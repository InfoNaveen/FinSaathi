import type { ExtractedClause, RiskCardData } from '@/types'

export const sampleDocumentText = `SURYODAY FINANCE PERSONAL LOAN AGREEMENT

Borrower: Demo Customer
Loan Amount: Rs. 4,00,000
Annual Interest Rate: 17.75% floating
Tenure: 36 months

1. Processing Fee: The borrower shall pay a non-refundable processing fee of 3.5% of the sanctioned loan amount plus applicable taxes. This amount may be deducted from disbursement.

2. Foreclosure and Prepayment: The borrower may foreclose the loan only after six EMIs have been paid. A foreclosure penalty of 5% of the outstanding principal shall be charged on any early closure or part-prepayment.

3. Insurance Requirement: The borrower agrees that loan protection insurance is mandatory for disbursement. The premium shall be financed with the loan and cannot be opted out by the borrower.

4. Penal Charges: In case of delayed EMI payment, penal interest at 3% per month shall be charged on overdue amounts and such penal interest shall be compounded monthly until payment is received.

5. Variable Rate: The lender may revise the interest rate based on internal policy, market conditions, or cost of funds. Notice may be sent by SMS, email, or customer portal update.

6. Arbitration: Any dispute shall be referred to sole arbitration appointed by the lender, with venue at Mumbai.`

export const sampleExtractedClauses: ExtractedClause[] = [
  {
    clause_type: 'processing_fee',
    raw_text:
      'The borrower shall pay a non-refundable processing fee of 3.5% of the sanctioned loan amount plus applicable taxes.',
    extracted_value: 3.5,
    extracted_unit: 'percent',
    page_reference: 'Section 1'
  },
  {
    clause_type: 'foreclosure_penalty',
    raw_text:
      'A foreclosure penalty of 5% of the outstanding principal shall be charged on any early closure or part-prepayment.',
    extracted_value: 5,
    extracted_unit: 'percent',
    page_reference: 'Section 2'
  },
  {
    clause_type: 'insurance_bundling',
    raw_text:
      'The borrower agrees that loan protection insurance is mandatory for disbursement and cannot be opted out.',
    extracted_value: 1,
    extracted_unit: 'mandatory',
    page_reference: 'Section 3'
  },
  {
    clause_type: 'penal_interest',
    raw_text:
      'Penal interest at 3% per month shall be charged on overdue amounts and compounded monthly until payment is received.',
    extracted_value: 3,
    extracted_unit: 'percent_per_month',
    page_reference: 'Section 4'
  },
  {
    clause_type: 'variable_rate',
    raw_text:
      'The lender may revise the interest rate based on internal policy, market conditions, or cost of funds.',
    extracted_value: null,
    extracted_unit: null,
    page_reference: 'Section 5'
  }
]

export const sampleRiskCardData: RiskCardData = {
  document_type: 'Personal Loan Agreement',
  overall_risk: 'CRITICAL',
  verdict: 'RISKY',
  verdict_reason_english:
    'This agreement contains multiple serious charges above benchmark levels. The foreclosure penalty, forced insurance, and compounded penal interest need correction before signing.',
  verdict_reason_hindi:
    'इस समझौते में कई गंभीर शुल्क तय सीमा से ऊपर हैं। साइन करने से पहले फोरक्लोजर पेनल्टी, जबरन बीमा और कंपाउंड पेनल ब्याज हटवाएं।',
  critical_count: 3,
  high_count: 1,
  analyzed_at: new Date(0).toISOString(),
  suspicious: false,
  suspicious_flags: [],
  fallback: false,
  clauses: [
    {
      ...sampleExtractedClauses[1],
      risk_level: 'CRITICAL',
      benchmark_max: 2,
      benchmark_source: 'RBI Circular RBI/2023-24/55',
      is_above_benchmark: true,
      plain_english: 'You must pay a very high fee if you close the loan early.',
      plain_hindi: 'अगर आप loan जल्दी बंद करेंगे, तो बहुत ज्यादा शुल्क देना पड़ेगा।',
      plain_vernacular: '',
      negotiation_tip: 'Ask the lender to reduce foreclosure charges to 0-2% or remove them for floating-rate loans.'
    },
    {
      ...sampleExtractedClauses[2],
      risk_level: 'CRITICAL',
      benchmark_max: null,
      benchmark_source: 'IRDAI Circular 2021 - Prohibition on bundling',
      is_above_benchmark: true,
      plain_english: 'The lender is forcing you to buy insurance with the loan.',
      plain_hindi: 'लेंडर आपको loan के साथ बीमा खरीदने के लिए मजबूर कर रहा है।',
      plain_vernacular: '',
      negotiation_tip: 'Ask for written confirmation that insurance is optional and can be bought separately.'
    },
    {
      ...sampleExtractedClauses[3],
      risk_level: 'CRITICAL',
      benchmark_max: 2,
      benchmark_source: 'RBI Circular Aug 2023 - Penal Charges',
      is_above_benchmark: true,
      plain_english: 'Late EMI charges are high and can grow every month.',
      plain_hindi: 'EMI देर होने पर शुल्क ज्यादा है और हर महीने बढ़ सकता है।',
      plain_vernacular: '',
      negotiation_tip: 'Ask them to remove monthly compounding and cap late charges clearly.'
    },
    {
      ...sampleExtractedClauses[0],
      risk_level: 'HIGH',
      benchmark_max: 2,
      benchmark_source: 'RBI Fair Practices Code 2023',
      is_above_benchmark: true,
      plain_english: 'The upfront loan fee is higher than a normal benchmark.',
      plain_hindi: 'Loan लेते समय लगने वाला शुल्क सामान्य सीमा से ज्यादा है।',
      plain_vernacular: '',
      negotiation_tip: 'Ask for a lower processing fee or a written waiver before disbursal.'
    },
    {
      ...sampleExtractedClauses[4],
      risk_level: 'MEDIUM',
      benchmark_max: null,
      benchmark_source: 'RBI Fair Practices Code',
      is_above_benchmark: false,
      plain_english: 'Your interest rate may change later based on lender policy.',
      plain_hindi: 'आपका ब्याज दर बाद में लेंडर की policy से बदल सकता है।',
      plain_vernacular: '',
      negotiation_tip: 'Ask for advance written notice and a clear reason for any rate change.'
    }
  ]
}
