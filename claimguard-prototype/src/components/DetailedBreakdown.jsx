import { ArrowLeft, FileText, AlertCircle, IndianRupee, Check, X, AlertTriangle } from 'lucide-react';

function DetailedBreakdown({ scenario, onBack }) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-cyan-600 hover:text-cyan-700 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Report Card</span>
      </button>

      {/* Header */}
      <div className={`p-6 rounded-2xl mb-8 ${
        scenario.status === 'covered'
          ? 'bg-gradient-to-r from-green-500 to-emerald-600'
          : scenario.status === 'partial'
          ? 'bg-gradient-to-r from-yellow-500 to-orange-600'
          : 'bg-gradient-to-r from-red-500 to-rose-600'
      }`}>
        <div className="flex items-center space-x-4 text-white">
          {scenario.status === 'covered' ? (
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>
          ) : scenario.status === 'partial' ? (
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <X className="w-8 h-8" />
            </div>
          )}
          
          <div>
            <h1 className="text-3xl font-bold mb-2">{scenario.name}</h1>
            <p className="text-lg opacity-90">
              {scenario.status === 'covered' ? 'Fully Covered ✓' : 
               scenario.status === 'partial' ? 'Partially Covered ⚠' : 
               'Not Covered ✗'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
        {/* Payout Info */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <IndianRupee className="w-5 h-5 mr-2 text-cyan-500" />
            Financial Impact
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-cyan-50 rounded-xl border-2 border-cyan-200">
              <p className="text-sm text-gray-600 mb-1">Insurance Payout</p>
              <p className="text-2xl font-bold text-cyan-600">{scenario.payout}</p>
            </div>
            
            {scenario.outOfPocket && (
              <div className="p-4 bg-red-50 rounded-xl border-2 border-red-200">
                <p className="text-sm text-gray-600 mb-1">Your Out-of-Pocket Cost</p>
                <p className="text-2xl font-bold text-red-600">{scenario.outOfPocket}</p>
              </div>
            )}
          </div>
        </div>

        {/* Reason */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-cyan-500" />
            Why This Decision?
          </h2>
          
          <p className="text-gray-700 text-lg leading-relaxed">{scenario.reason}</p>
        </div>

        {/* Policy Clause */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-cyan-500" />
            Relevant Policy Clause
          </h2>
          
          <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Reference: {scenario.clause}</p>
            <p className="text-gray-700 italic">
              "{scenario.reason}"
            </p>
          </div>
        </div>

        {/* What This Means */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">What This Means for You</h2>
          
          {scenario.status === 'covered' ? (
            <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
              <p className="text-green-900 font-medium mb-2">✓ You're Protected</p>
              <p className="text-green-800">
                If this medical emergency occurs, your insurance will cover the costs. Make sure to:
              </p>
              <ul className="list-disc list-inside text-green-800 mt-2 space-y-1">
                <li>Keep your premiums up to date</li>
                <li>Inform your insurer within 24 hours of hospitalization</li>
                <li>Use network hospitals for cashless treatment</li>
              </ul>
            </div>
          ) : scenario.status === 'partial' ? (
            <div className="p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
              <p className="text-yellow-900 font-medium mb-2">⚠ Partial Coverage Gap</p>
              <p className="text-yellow-800">
                Your policy will cover part of the cost, but you'll need to pay {scenario.outOfPocket} from your pocket. Consider:
              </p>
              <ul className="list-disc list-inside text-yellow-800 mt-2 space-y-1">
                <li>Building an emergency fund for the uncovered portion</li>
                <li>Upgrading to a policy without sub-limits</li>
                <li>Buying a super top-up plan to cover the gap</li>
              </ul>
            </div>
          ) : (
            <div className="p-4 bg-red-50 rounded-xl border-2 border-red-200">
              <p className="text-red-900 font-medium mb-2">✗ Critical Coverage Gap</p>
              <p className="text-red-800">
                This treatment is NOT covered by your current policy. You would need to pay the entire cost ({scenario.outOfPocket || 'full amount'}) yourself. Urgent actions:
              </p>
              <ul className="list-disc list-inside text-red-800 mt-2 space-y-1">
                <li>Consider upgrading your policy immediately</li>
                <li>Look for riders that cover this specific treatment</li>
                <li>Build a dedicated medical emergency fund</li>
                {scenario.reason.includes('waiting period') && (
                  <li>Wait for the waiting period to complete before non-urgent procedures</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-8 text-center">
        <button
          onClick={onBack}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg"
        >
          View All Scenarios
        </button>
      </div>
    </div>
  );
}

export default DetailedBreakdown;
