import React, { useEffect, useState } from 'react';
import { aiService } from '../services/AILearningService';
import { AIPersonality } from '../types';
import { BarChart2, Activity, Zap, Users, Brain } from 'lucide-react';

const AnalyticsDashboard: React.FC = () => {
    const [personality, setPersonality] = useState<AIPersonality>(aiService.getPersonality());
    const [stats, setStats] = useState(aiService.getSessionSummary());

    useEffect(() => {
        const unsub = aiService.subscribe((p) => {
            setPersonality(p);
            setStats(aiService.getSessionSummary());
        });
        return unsub;
    }, []);

    const TraitBar = ({ label, value, icon: Icon, color }: { label: string, value: number, icon: any, color: string }) => (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2 text-gray-300">
                    <Icon size={16} className={color} />
                    <span className="text-sm font-medium">{label}</span>
                </div>
                <span className="text-sm font-mono">{Math.round(value)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                    className={`h-2.5 rounded-full transition-all duration-1000 ${color.replace('text-', 'bg-')}`}
                    style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                ></div>
            </div>
        </div>
    );

    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 h-full overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BarChart2 className="text-purple-500" />
                AI Partner Analytics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personality Matrix */}
                <div className="bg-gray-900 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-purple-400">Personality Matrix</h3>
                    <TraitBar label="Risk Tolerance" value={personality.riskTolerance} icon={Activity} color="text-red-500" />
                    <TraitBar label="Energy Management" value={personality.energyManagement} icon={Zap} color="text-yellow-500" />
                    <TraitBar label="Crowd Adaptation" value={personality.crowdAdaptation} icon={Users} color="text-blue-500" />
                    <TraitBar label="Genre Exploration" value={personality.genreExploration} icon={Brain} color="text-purple-500" />

                    <div className="mt-6 p-4 bg-gray-800 rounded border border-gray-700">
                        <h4 className="text-xs uppercase text-gray-500 font-bold mb-2">AI Evolution Status</h4>
                        <p className="text-sm text-gray-300">
                            Learning Velocity: <span className="text-green-400">{personality.learningVelocity}%</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            The AI is actively analyzing your transition patterns and EQ usage to adapt its future suggestions.
                        </p>
                    </div>
                </div>

                {/* Session Stats */}
                <div className="bg-gray-900 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-purple-400">Current Session</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-800 p-4 rounded text-center">
                            <div className="text-3xl font-bold text-white">{stats.interactionCount}</div>
                            <div className="text-xs text-gray-500 uppercase mt-1">Interactions</div>
                        </div>
                        <div className="bg-gray-800 p-4 rounded text-center">
                            <div className="text-3xl font-bold text-white">{Math.floor(stats.duration / 1000 / 60)}m</div>
                            <div className="text-xs text-gray-500 uppercase mt-1">Duration</div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h4 className="text-xs uppercase text-gray-500 font-bold mb-2">Recent Activity Log</h4>
                        <div className="h-48 overflow-y-auto space-y-2 text-xs font-mono bg-black p-2 rounded">
                            {stats.interactions.slice().reverse().map((int, i) => (
                                <div key={i} className="text-gray-400 border-b border-gray-800 pb-1 mb-1">
                                    <span className="text-purple-500">[{new Date(int.timestamp).toLocaleTimeString()}]</span> {int.type} @ {int.target}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
