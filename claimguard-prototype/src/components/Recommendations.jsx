import { ArrowLeft, Shield, TrendingUp, CheckCircle, ExternalLink, RotateCcw } from 'lucide-react';

function Recommendations({ recommendations, onBack, onRestart }) {
  const urgencyColors = {
    high: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', badge: 'bg-red-500' },
    medium: { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-700', badge: 'bg-yellow-500' },
    low: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700', badge: 'bg-blue-500' }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-cyan-600 hover:text-cyan-700 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Report Card</span>
      </button>

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-block p-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mb-4">
          <Shield className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Fix Your Coverage Gaps</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Based on your policy analysis, here are personalized recommendations to close your coverage gaps and protect yourself from unexpected costs.
        </p>
      </div>

      {/* Recommendations */}
      <div className="space-y-6 mb-12">
        {recommendations.map((rec, index) => {
          const colors = urgencyColors[rec.urgency];
          
          return (
            <div key={index} className={`${colors.bg} border-2 ${colors.border} rounded-2xl p-6 transition-all hover:shadow-lg`}>
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{rec.title}</h3>
                    <span className={`${colors.badge} text-white text-xs font-bold px-3 py-1 rounded-full uppercase`}>
                      {rec.urgency} Priority
                    </span>
                  </div>
                  <p className={`text-sm ${colors.text} font-medium`}>
                    Recommended to close critical coverage gaps
                  </p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Annual Cost</p>
                  <p className="text-2xl font-bold text-gray-900">{rec.cost}</p>
                  <p className="text-xs text-gray-500 mt-1">~{Math.round(parseInt(rec.cost.replace(/[^0-9]/g, '')) / 12)} per month</p>
                </div>

                <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Coverage Benefit</p>
                  <p className="text-lg font-bold text-green-600">{rec.benefit}</p>
                </div>
              </div>

              {/* What You Get */}
              <div className="bg-white rounded-xl p-4 border-2 border-gray-200 mb-4">
                <p className="font-semibold text-gray-900 mb-2">What You Get:</p>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Eliminates out-of-pocket expenses for covered scenarios</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Peace of mind for you and your family</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Can be added to existing policy without cancellation</span>
                  </li>
                </ul>
              </div>

              {/* CTA */}
              <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center justify-center space-x-2">
                <span>Get This Coverage</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Impact Summary */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200 mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Total Investment vs Protection</h3>
            <p className="text-gray-600">If you implement all recommendations</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600 mb-2">Total Annual Cost</p>
            <p className="text-3xl font-bold text-gray-900">
              ₹{recommendations.reduce((sum, rec) => sum + parseInt(rec.cost.replace(/[^0-9]/g, '')), 0).toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600 mb-2">Potential Savings</p>
            <p className="text-3xl font-bold text-green-600">₹15L+</p>
            <p className="text-xs text-gray-500 mt-1">In prevented out-of-pocket costs</p>
          </div>

          <div className="bg-white rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600 mb-2">Coverage Improvement</p>
            <p className="text-3xl font-bold text-cyan-600">12 → 18</p>
            <p className="text-xs text-gray-500 mt-1">Scenarios fully covered</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-green-100 rounded-xl border-2 border-green-300">
          <p className="text-green-900 font-semibold text-center">
            ✨ ROI: For every ₹1 spent, you avoid ₹80+ in potential medical debt
          </p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onBack}
          className="bg-white border-2 border-cyan-500 text-cyan-600 font-bold py-3 px-8 rounded-xl hover:bg-cyan-50 transition-all"
        >
          View Report Card Again
        </button>
        
        <button
          onClick={onRestart}
          className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Analyze Another Policy</span>
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-xs text-gray-500 mt-8 max-w-2xl mx-auto">
        * Recommendations are based on AI analysis of your policy document. Actual coverage and costs may vary. 
        Please consult with licensed insurance advisors before making purchase decisions.
      </p>
    </div>
  );
}

export default Recommendations;
