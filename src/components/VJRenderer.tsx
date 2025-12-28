import { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { vsSource, fsPassthroughSource, datamoshShader, pixelSortShader, feedbackShader, colorShiftShader } from '../utils/glitchShaders';

export interface VJRendererRef {
    setEffect: (effectName: 'datamosh' | 'pixelsort' | 'feedback' | 'colorshift' | 'none') => void;
    setControlValue: (name: string, value: number) => void;
}

interface VJRendererProps {
    videoSourceA: HTMLVideoElement | null;
    videoSourceB: HTMLVideoElement | null;
    opacityA: number;
    opacityB: number;
    mixBlendModeB: string;
}

const VJRenderer = forwardRef<VJRendererRef, VJRendererProps>(({ videoSourceA, videoSourceB, opacityA, opacityB, mixBlendModeB }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const glRef = useRef<WebGLRenderingContext | null>(null);
    const animationRef = useRef<number>();

    // WebGL Resources
    const resources = useRef<any>({});

    // State for controls
    const [effect, setEffectState] = useState<'datamosh' | 'pixelsort' | 'feedback' | 'colorshift' | 'none'>('datamosh');
    const controls = useRef({
        trail: 0.9, motion: 0.12, hue: 0.0, history: 6, extrap: 0.0, intensity: 0.5,
        displacement: 0.01, feedback: 0.2, threshold: 0.5, brightness: 0.0, contrast: 1.0, saturation: 1.0
    });

    // Refs to store latest props for the render loop
    const propsRef = useRef({
        effect,
        opacityA,
        opacityB,
        mixBlendModeB,
        videoSourceA,
        videoSourceB
    });

    // Sync props to ref
    useEffect(() => {
        propsRef.current = {
            effect,
            opacityA,
            opacityB,
            mixBlendModeB,
            videoSourceA,
            videoSourceB
        };
    }, [effect, opacityA, opacityB, mixBlendModeB, videoSourceA, videoSourceB]);

    // Expose controls to parent
    useImperativeHandle(ref, () => ({
        setEffect: (e) => setEffectState(e),
        setControlValue: (name, val) => {
            // @ts-ignore
            controls.current[name] = val;
        }
    }));

    // Initialize WebGL
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl', { premultipliedAlpha: false, antialias: false });
        if (!gl) return;
        glRef.current = gl;

        // Compile Shaders
        const compileShader = (src: string, type: number) => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, src);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader));
                return null;
            }
            return shader;
        };

        const createProgram = (vs: string, fs: string) => {
            const p = gl.createProgram();
            if (!p) return null;
            const v = compileShader(vs, gl.VERTEX_SHADER);
            const f = compileShader(fs, gl.FRAGMENT_SHADER);
            if (!v || !f) return null;
            gl.attachShader(p, v);
            gl.attachShader(p, f);
            gl.linkProgram(p);
            return p;
        };

        const programs = {
            datamosh: createProgram(vsSource, datamoshShader),
            pixelsort: createProgram(vsSource, pixelSortShader),
            feedback: createProgram(vsSource, feedbackShader),
            colorshift: createProgram(vsSource, colorShiftShader),
            passthrough: createProgram(vsSource, fsPassthroughSource)
        };

        // Buffers
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

        const texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), gl.STATIC_DRAW);

        // Textures & FBOs
        const createTexture = (w: number, h: number) => {
            const t = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, t);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            return t;
        };

        // Initial Size (will resize later)
        const w = canvas.width || 1280;
        const h = canvas.height || 720;

        resources.current = {
            gl, programs, positionBuffer, texCoordBuffer,
            textures: {
                sourceA: createTexture(w, h),
                sourceB: createTexture(w, h),
                mixed: createTexture(w, h), // The result of mixing A and B before effects
                fbo1: createTexture(w, h),
                fbo2: createTexture(w, h)
            },
            fbos: {
                fbo1: gl.createFramebuffer(),
                fbo2: gl.createFramebuffer(),
                mixed: gl.createFramebuffer()
            },
            currentSource: 'fbo2',
            currentDest: 'fbo1',
            startTime: performance.now()
        };

        // Attach textures to FBOs
        const { fbos, textures } = resources.current;
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbos.fbo1);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textures.fbo1, 0);

        gl.bindFramebuffer(gl.FRAMEBUFFER, fbos.fbo2);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textures.fbo2, 0);

        gl.bindFramebuffer(gl.FRAMEBUFFER, fbos.mixed);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textures.mixed, 0);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        return () => {
            // Cleanup
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, []);

    // Render Loop
    useEffect(() => {
        // Optimized: Only create helper functions ONCE per mount
        const drawTexture = (gl: WebGLRenderingContext, programs: any, positionBuffer: WebGLBuffer, texCoordBuffer: WebGLBuffer, tex: WebGLTexture, opacity: number, blend: string) => {
            if (opacity <= 0) return;
            gl.useProgram(programs.passthrough);

            // Uniforms
            gl.enable(gl.BLEND);
            if (blend === 'screen') gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_COLOR); // Approximation
            else gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // Normal

            // Bind Attributes
            const pLoc = gl.getAttribLocation(programs.passthrough, 'a_position');
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.vertexAttribPointer(pLoc, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(pLoc);

            const tLoc = gl.getAttribLocation(programs.passthrough, 'a_texCoord');
            gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
            gl.vertexAttribPointer(tLoc, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(tLoc);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.uniform1i(gl.getUniformLocation(programs.passthrough, 'u_textureToDraw'), 0);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
            gl.disable(gl.BLEND);
        };

        const setUniform = (gl: WebGLRenderingContext, prog: WebGLProgram, name: string, val: number) => {
            const loc = gl.getUniformLocation(prog, name);
            if (loc) gl.uniform1f(loc, val);
        };

        const render = () => {
            const { gl, programs, positionBuffer, texCoordBuffer, textures, fbos, currentSource, currentDest, startTime } = resources.current;
            if (!gl) return;

            // ⚡ Optimization: Access latest props from ref to avoid restarting loop
            const { effect, opacityA, opacityB, mixBlendModeB, videoSourceA, videoSourceB } = propsRef.current;

            const width = gl.canvas.width;
            const height = gl.canvas.height;
            gl.viewport(0, 0, width, height);

            // 1. Upload Video Frames to Textures
            if (videoSourceA && videoSourceA.readyState >= 2) {
                gl.bindTexture(gl.TEXTURE_2D, textures.sourceA);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, videoSourceA);
            }
            if (videoSourceB && videoSourceB.readyState >= 2) {
                gl.bindTexture(gl.TEXTURE_2D, textures.sourceB);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, videoSourceB);
            }

            // 2. Mix A and B
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbos.mixed);
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);

            // Draw A
            drawTexture(gl, programs, positionBuffer, texCoordBuffer, textures.sourceA, opacityA, 'normal');
            // Draw B
            drawTexture(gl, programs, positionBuffer, texCoordBuffer, textures.sourceB, opacityB, mixBlendModeB === 'screen' ? 'screen' : 'normal');


            // 3. Apply Effect
            const destFBO = fbos[currentDest];
            const sourceTex = textures[currentSource]; // History

            gl.bindFramebuffer(gl.FRAMEBUFFER, destFBO);
            const prog = programs[effect] || programs.passthrough;
            gl.useProgram(prog);

            const ctrls = controls.current;
            setUniform(gl, prog, 'u_time', (performance.now() - startTime) / 1000);
            setUniform(gl, prog, 'u_motionThreshold', ctrls.motion);
            setUniform(gl, prog, 'u_trailPersistence', ctrls.trail);
            setUniform(gl, prog, 'u_hueShiftSpeed', ctrls.hue);
            setUniform(gl, prog, 'u_motionExtrapolation', ctrls.extrap);
            setUniform(gl, prog, 'u_intensity', ctrls.intensity);
            setUniform(gl, prog, 'u_displacement', ctrls.displacement);
            setUniform(gl, prog, 'u_feedback', ctrls.feedback);
            setUniform(gl, prog, 'u_threshold', ctrls.threshold);
            setUniform(gl, prog, 'u_brightness', ctrls.brightness);
            setUniform(gl, prog, 'u_contrast', ctrls.contrast);
            setUniform(gl, prog, 'u_saturation', ctrls.saturation);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, textures.mixed);
            gl.uniform1i(gl.getUniformLocation(prog, 'u_webcamTexture'), 0);

            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, sourceTex);
            gl.uniform1i(gl.getUniformLocation(prog, 'u_previousFrameTexture'), 1);

            gl.drawArrays(gl.TRIANGLES, 0, 6);

            // 4. Draw to Screen
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.useProgram(programs.passthrough);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, textures[currentDest]);
            gl.uniform1i(gl.getUniformLocation(programs.passthrough, 'u_textureToDraw'), 0);
            gl.drawArrays(gl.TRIANGLES, 0, 6);

            // Swap
            resources.current.currentSource = currentDest;
            resources.current.currentDest = currentSource === 'fbo1' ? 'fbo2' : 'fbo1';

            animationRef.current = requestAnimationFrame(render);
        };

        animationRef.current = requestAnimationFrame(render);
        return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
    }, []); // ⚡ No dependencies = loop runs uninterrupted

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full object-cover"
            width={1280}
            height={720}
        />
    );
});

export default VJRenderer;
