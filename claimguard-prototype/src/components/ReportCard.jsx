import { Check, X, AlertTriangle, TrendingDown, Shield, ArrowRight, RotateCcw } from 'lucide-react';

function ReportCard({ results, userData, onScenarioClick, onViewRecommendations, onRestart }) {
  const { vulnerabilityScore, totalScenarios, scenarios } = results;
  
  const passed = scenarios.filter(s => s.status === 'covered').length;
  const failed = scenarios.filter(s => s.status === 'rejected').length;
  const partial = scenarios.filter(s => s.status === 'partial').length;

  const scorePercentage = (vulnerabilityScore / totalScenarios) * 100;
  const scoreColor = scorePercentage >= 70 ? 'green' : scorePercentage >= 50 ? 'yellow' : 'red';

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="text-center mb-8">
        <button
          onClick={onRestart}
          className="inline-flex items-center space-x-2 text-cyan-600 hover:text-cyan-700 mb-4"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm font-medium">Analyze Another Policy</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Policy Health Report Card</h1>
        <p className="text-gray-600">Policy analyzed for: <span className="font-semibold">{userData.name}</span>, Age {userData.age}</p>
      </div>

      {/* Vulnerability Score Card */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-8 mb-8 border-2 border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Policy Vulnerability Score</h2>
            <p className="text-gray-600">Based on 20 critical medical scenarios</p>
          </div>
          <Shield className="w-12 h-12 text-cyan-500" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Score Visualization */}
          <div className="relative">
            <div className="w-48 h-48 mx-auto">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke={scoreColor === 'green' ? '#10b981' : scoreColor === 'yellow' ? '#f59e0b' : '#ef4444'}
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${502 * (scorePercentage / 100)} 502`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-5xl font-bold text-gray-900">{vulnerabilityScore}</span>
                <span className="text-gray-500 text-lg">/ {totalScenarios}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border-2 border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Covered</span>
              </div>
              <span className="text-2xl font-bold text-green-600">{passed}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Partial</span>
              </div>
              <span className="text-2xl font-bold text-yellow-600">{partial}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border-2 border-red-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <X className="w-6 h-6 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Rejected</span>
              </div>
              <span className="text-2xl font-bold text-red-600">{failed}</span>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        {scorePercentage < 70 && (
          <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <div className="flex items-start space-x-3">
              <TrendingDown className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Critical Coverage Gaps Detected</p>
                <p className="text-sm text-red-700 mt-1">
                  Your policy fails {failed + partial} out of {totalScenarios} scenarios. You could face unexpected out-of-pocket costs.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scenarios Grid */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Detailed Scenario Analysis</h3>
        <p className="text-gray-600 mb-6">Click on any scenario to see why it passed or failed</p>

        <div className="grid md:grid-cols-2 gap-4">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => onScenarioClick(scenario)}
              className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-lg hover:scale-105 ${
                scenario.status === 'covered'
                  ? 'bg-green-50 border-green-300 hover:bg-green-100'
                  : scenario.status === 'partial'
                  ? 'bg-yellow-50 border-yellow-300 hover:bg-yellow-100'
                  : 'bg-red-50 border-red-300 hover:bg-red-100'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {scenario.status === 'covered' ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : scenario.status === 'partial' ? (
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                    <h4 className="font-semibold text-gray-900">{scenario.name}</h4>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2">{scenario.reason}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      scenario.status === 'covered'
                        ? 'bg-green-200 text-green-800'
                        : scenario.status === 'partial'
                        ? 'bg-yellow-200 text-yellow-800'
                        : 'bg-red-200 text-red-800'
                    }`}>
                      {scenario.status === 'covered' ? 'COVERED' : scenario.status === 'partial' ? 'PARTIAL' : 'REJECTED'}
                    </span>
                    
                    <span className="text-sm font-bold text-gray-900">
                      {scenario.payout}
                    </span>
                  </div>
                </div>
                
                <ArrowRight className="w-5 h-5 text-gray-400 ml-4" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div className="text-center">
        <button
          onClick={onViewRecommendations}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 px-8 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Shield className="w-5 h-5" />
          <span>Fix Your Coverage Gaps</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-sm text-gray-500 mt-3">Get personalized recommendations to close coverage gaps</p>
      </div>
    </div>
  );
}

export default ReportCard;
