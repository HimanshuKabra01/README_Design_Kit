import { useState, useEffect } from "react";
import {
  Lightbulb,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Settings,
  RefreshCw,
  Bot,
  Wand2,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Edit3,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { analyzeBranding } from "@/utils/brandingAnalyzer";
import type { BrandingTone, BrandingAnalysis, SuggestionAction } from "@/types/branding";
import type { ElementType } from "@/types/elements";

// Enhanced action types for suggestions
export type SuggestionActionType = 'edit' | 'add' | 'remove' | 'reorder' | 'enhance';

export interface EnhancedSuggestionAction {
  type: SuggestionActionType;
  elementId?: string;
  newContent?: string;
  elementToAdd?: Partial<ElementType>;
  targetPosition?: number;
  direction?: 'up' | 'down';
}

interface ReadmeAnalysisProps {
  elements: ElementType[];
  isEditorActive: boolean;
  onApplySuggestion: (elementId: string, newContent: string) => void;
  // Enhanced callback for complex actions
  onApplyAction?: (action: SuggestionAction) => void;
  onAddElement?: (element: ElementType) => void;
  onRemoveElement?: (elementId: string) => void;
  onReorderElement?: (elementId: string, direction: 'up' | 'down') => void;
}

const TONE_DESCRIPTIONS: Record<BrandingTone, string> = {
  casual: "Friendly and approachable, perfect for personal projects",
  technical: "Precise and detailed, ideal for developer tools",
  professional: "Polished and confident, great for business solutions",
  "open-source": "Welcoming and inclusive, perfect for community projects",
};

const SEVERITY_COLORS = {
  high: "destructive",
  medium: "default",
  low: "secondary",
} as const;

const SEVERITY_ICONS = {
  high: AlertCircle,
  medium: Lightbulb,
  low: CheckCircle,
};

export function ReadmeAnalysis({
  elements,
  isEditorActive,
  onApplySuggestion,
  onApplyAction,
  onAddElement,
  onRemoveElement,
  onReorderElement,
}: ReadmeAnalysisProps) {
  const [selectedTone, setSelectedTone] = useState<BrandingTone>("professional");
  const [analysis, setAnalysis] = useState<BrandingAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAutoImplementing, setIsAutoImplementing] = useState(false);

  useEffect(() => {
    if (!isEditorActive) return;
    
    const analyzeContent = async () => {
      setIsAnalyzing(true);
      try {
        const result = await analyzeBranding(elements, selectedTone);
        setAnalysis(result);
      } catch (error) {
        console.error('Error analyzing branding:', error);
        setAnalysis({
          suggestions: [{
            section: 'Analysis Error',
            suggestion: 'Unable to analyze README content',
            reason: 'There was an error analyzing your content. Please try again.',
            severity: 'low',
            type: 'structure',
          }],
          overallScore: 50,
          toneConsistency: 50,
          selectedTone: selectedTone,
          detectedTone: selectedTone,
        });
      } finally {
        setIsAnalyzing(false);
      }
    };
    
    analyzeContent();
  }, [elements, selectedTone, isEditorActive]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const handleAutoImplement = async () => {
    if (!analysis) return;
    
    setIsAutoImplementing(true);
    try {
      const implementableSuggestions = analysis.suggestions.filter(s => s.elementId && s.fix);
      
      for (const suggestion of implementableSuggestions) {
        if (suggestion.elementId && suggestion.fix) {
          onApplySuggestion(suggestion.elementId, suggestion.fix);
          // Add a small delay between implementations to prevent overwhelming the UI
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } catch (error) {
      console.error('Error auto-implementing suggestions:', error);
    } finally {
      setIsAutoImplementing(false);
    }
  };

  return (
    <div className="w-full border-l border-border bg-background flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">README Analysis</h2>
          <Badge variant="secondary" className="text-xs">Powered by Gemini</Badge>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-2 block">Brand Tone</label>
            <Select
              value={selectedTone}
              onValueChange={(val) => setSelectedTone(val as BrandingTone)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(TONE_DESCRIPTIONS).map((tone) => (
                  <SelectItem key={tone} value={tone}>
                    {tone.charAt(0).toUpperCase() + tone.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {TONE_DESCRIPTIONS[selectedTone]}
            </p>

            {analysis?.detectedTone && analysis.detectedTone !== selectedTone && (
              <p className="text-xs text-yellow-600 mt-2">
                Detected tone: <strong>{analysis.detectedTone}</strong>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {isAnalyzing ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-sm">Analyzing content...</span>
            </div>
          </div>
        ) : analysis ? (
          <>
            <div className="grid grid-cols-1 gap-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Overall Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-2">
                    <Progress value={analysis.overallScore} className="flex-1" />
                    <span className={`text-sm font-medium ${getScoreColor(analysis.overallScore)}`}>
                      {analysis.overallScore}%
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Tone Consistency
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-2">
                    <Progress value={analysis.toneConsistency} className="flex-1" />
                    <span className={`text-sm font-medium ${getScoreColor(analysis.toneConsistency)}`}>
                      {analysis.toneConsistency}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  <h3 className="font-medium">Suggestions</h3>
                  <Badge variant="outline" className="text-xs">
                    {analysis.suggestions.length}
                  </Badge>
                </div>
                {analysis.suggestions.some(s => s.elementId && s.fix) && (
                  <button
                    onClick={handleAutoImplement}
                    disabled={isAutoImplementing}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isAutoImplementing ? (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    ) : (
                      <Wand2 className="h-3 w-3" />
                    )}
                    Auto Implement
                  </button>
                )}
              </div>

              {analysis.suggestions.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="text-sm">Great job! No suggestions at the moment.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {analysis.suggestions.map((s, index) => {
                    const Icon = SEVERITY_ICONS[s.severity];
                    return (
                      <Card key={index} className="p-3">
                        <div className="flex items-start gap-3">
                          <Icon
                            className={`h-4 w-4 mt-0.5 ${
                              s.severity === "high"
                                ? "text-red-500"
                                : s.severity === "medium"
                                ? "text-yellow-500"
                                : "text-green-500"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={SEVERITY_COLORS[s.severity]} className="text-xs">
                                {s.section}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {s.type}
                              </Badge>
                            </div>

                            <p className="text-sm text-foreground mb-1">{s.suggestion}</p>
                            <p className="text-xs text-muted-foreground">{s.reason}</p>

                            {(s.fixType || s.confidence) && (
                              <p className="text-xs text-muted-foreground mt-1 italic">
                                {s.fixType && `Fix type: ${s.fixType}`}
                                {s.fixType && s.confidence && " • "}
                                {s.confidence && `Confidence: ${(s.confidence * 100).toFixed(0)}%`}
                              </p>
                            )}

                            {s.excerpt && (
                              <blockquote className="text-xs text-muted-foreground italic border-l pl-3 mt-2">
                                “…{s.excerpt.trim()}…”
                              </blockquote>
                            )}

                            {s.elementId && s.fix && (
                              <button
                                onClick={() => onApplySuggestion(s.elementId!, s.fix!)}
                                className="mt-2 text-xs text-primary hover:underline"
                              >
                                Apply fix
                              </button>
                            )}

                            {/* Enhanced action handling */}
                            {s.action && onApplyAction && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {s.action.type === 'edit' && (
                                  <button
                                    onClick={() => onApplyAction(s.action!)}
                                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                  >
                                    <Edit3 className="h-3 w-3" />
                                    Edit Content
                                  </button>
                                )}
                                
                                {s.action.type === 'add' && onAddElement && (
                                  <button
                                    onClick={() => onAddElement && onAddElement(s.action!.elementToAdd as ElementType)}
                                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                                  >
                                    <Plus className="h-3 w-3" />
                                    Add Element
                                  </button>
                                )}
                                
                                {s.action.type === 'remove' && onRemoveElement && s.action.elementId && (
                                  <button
                                    onClick={() => onRemoveElement && onRemoveElement(s.action!.elementId!)}
                                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                    Remove
                                  </button>
                                )}
                                
                                {s.action.type === 'reorder' && onReorderElement && s.action.elementId && (
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => onReorderElement && onReorderElement(s.action!.elementId!, 'up')}
                                      className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                                    >
                                      <ArrowUp className="h-3 w-3" />
                                      Move Up
                                    </button>
                                    <button
                                      onClick={() => onReorderElement && onReorderElement(s.action!.elementId!, 'down')}
                                      className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                                    >
                                      <ArrowDown className="h-3 w-3" />
                                      Move Down
                                    </button>
                                  </div>
                                )}
                                
                                {s.action.type === 'enhance' && (
                                  <button
                                    onClick={() => onApplyAction(s.action!)}
                                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                                  >
                                    <Wand2 className="h-3 w-3" />
                                    Enhance
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Lightbulb className="h-5 w-5 mr-2" />
            <span className="text-sm">No analysis available.</span>
          </div>
        )}
      </div>
    </div>
  );
}
