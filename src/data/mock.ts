import type { RiskCardData } from "@/types";

export const MOCK_ANALYSIS: RiskCardData = {
  document_type: "Home Loan Agreement",
  overall_risk: "HIGH",
  verdict: "REVIEW",
  verdict_reason_english:
    "This agreement contains 2 critical clauses and 3 high-risk clauses that require careful review before signing. The interest rate is significantly above market benchmark and the prepayment penalty clause is unusually punitive.",
  verdict_reason_hindi:
    "इस समझौते में 2 महत्वपूर्ण धाराएं और 3 उच्च जोखिम धाराएं हैं जिन्हें हस्ताक्षर करने से पहले सावधानीपूर्वक समीक्षा की आवश्यकता है। ब्याज दर बाजार बेंचमार्क से काफी अधिक है।",
  clauses: [
    {
      clause_type: "Interest Rate",
      raw_text:
        "The borrower agrees to pay interest at the rate of 13.5% per annum on the outstanding principal balance, compounded monthly, for the entire tenure of the loan.",
      extracted_value: 13.5,
      extracted_unit: "% per annum",
      page_reference: "Page 3, Section 4.1",
      risk_level: "CRITICAL",
      benchmark_max: 9.5,
      benchmark_source: "RBI MPC Rate + 2.5% (Oct 2024)",
      is_above_benchmark: true,
      plain_english:
        "You are being charged 13.5% yearly interest, which is 4% higher than what most banks charge. On a ₹50L loan, this means you pay ₹2L extra every year.",
      plain_hindi:
        "आपसे 13.5% वार्षिक ब्याज लिया जा रहा है, जो अधिकांश बैंकों से 4% अधिक है। ₹50 लाख के ऋण पर, इसका मतलब है कि आप हर साल ₹2 लाख अतिरिक्त देते हैं।",
      plain_vernacular:
        "ನಿಮಗೆ 13.5% ವಾರ್ಷಿಕ ಬಡ್ಡಿ ವಿಧಿಸಲಾಗುತ್ತಿದೆ, ಇದು ಹೆಚ್ಚಿನ ಬ್ಯಾಂಕ್‌ಗಳಿಗಿಂತ 4% ಹೆಚ್ಚು.",
      negotiation_tip:
        "Ask the lender to match SBI's current home loan rate of 8.5%-9.15%. If they refuse, cite competitor offers. A 1% reduction on ₹50L saves ₹50,000/year.",
    },
    {
      clause_type: "Prepayment Penalty",
      raw_text:
        "In the event of early repayment, whether partial or full, within the first 5 years of the loan tenure, the borrower shall pay a prepayment charge equal to 4% of the outstanding principal amount.",
      extracted_value: 4,
      extracted_unit: "% of outstanding",
      page_reference: "Page 5, Section 7.3",
      risk_level: "CRITICAL",
      benchmark_max: 2,
      benchmark_source: "RBI Guideline: Max 2% for floating rate loans",
      is_above_benchmark: true,
      plain_english:
        "If you try to pay off your loan early, you'll be penalized 4% of what you still owe. RBI caps this at 2% for floating rate loans. This clause may be illegal.",
      plain_hindi:
        "यदि आप अपना ऋण जल्दी चुकाने की कोशिश करते हैं, तो आप पर बकाया राशि का 4% जुर्माना लगाया जाएगा। RBI ने इसे 2% तक सीमित किया है।",
      plain_vernacular:
        "ನೀವು ಸಾಲವನ್ನು ಮುಂಚಿತವಾಗಿ ಪಾವತಿಸಲು ಪ್ರಯತ್ನಿಸಿದರೆ, ನಿಮಗೆ 4% ದಂಡ ವಿಧಿಸಲಾಗುತ್ತದೆ.",
      negotiation_tip:
        "This may violate RBI's 2024 guidelines on floating rate home loans. Request removal or reduction to 1%. Cite RBI Circular RBI/2024-25/45.",
    },
    {
      clause_type: "Processing Fee",
      raw_text:
        "A non-refundable processing fee of 2.5% of the sanctioned loan amount plus applicable taxes shall be payable at the time of loan disbursement.",
      extracted_value: 2.5,
      extracted_unit: "% of loan amount",
      page_reference: "Page 2, Section 2.4",
      risk_level: "HIGH",
      benchmark_max: 1.0,
      benchmark_source: "Industry average: 0.5%–1%",
      is_above_benchmark: true,
      plain_english:
        "You pay 2.5% of your loan just in fees before you even receive the money. On ₹50L, that's ₹1.25L gone immediately—non-refundable.",
      plain_hindi:
        "आपको पैसे मिलने से पहले ही अपने ऋण का 2.5% शुल्क देना होगा। ₹50 लाख पर, यह तुरंत ₹1.25 लाख चला जाता है।",
      plain_vernacular:
        "ನೀವು ಹಣ ಪಡೆಯುವ ಮೊದಲೇ ನಿಮ್ಮ ಸಾಲದ 2.5% ಶುಲ್ಕ ಪಾವತಿಸಬೇಕು.",
      negotiation_tip:
        "Negotiate this down to 0.5% or request a flat cap of ₹10,000. Most lenders will reduce this for borrowers with CIBIL score above 750.",
    },
    {
      clause_type: "Insurance Bundling",
      raw_text:
        "The borrower is required to obtain and maintain a life insurance policy with a minimum sum assured equal to the outstanding loan amount from an insurer approved by the lender throughout the loan tenure.",
      extracted_value: null,
      extracted_unit: null,
      page_reference: "Page 6, Section 9.1",
      risk_level: "HIGH",
      benchmark_max: null,
      benchmark_source: null,
      is_above_benchmark: false,
      plain_english:
        "The bank is forcing you to buy life insurance from their approved list—not a free market choice. This likely benefits the bank through commission. You have the right to choose your own insurer.",
      plain_hindi:
        "बैंक आपको उनकी अनुमोदित सूची से जीवन बीमा खरीदने के लिए मजबूर कर रहा है। यह आपका स्वतंत्र विकल्प नहीं है। आपको अपना बीमाकर्ता चुनने का अधिकार है।",
      plain_vernacular:
        "ಬ್ಯಾಂಕ್ ನಿಮ್ಮನ್ನು ಅವರ ಅನುಮೋದಿತ ಪಟ್ಟಿಯಿಂದ ಜೀವ ವಿಮೆ ಖರೀದಿಸಲು ಒತ್ತಾಯಿಸುತ್ತಿದೆ.",
      negotiation_tip:
        "IRDA regulations allow you to choose your own insurer. Request removal of the 'approved insurer' restriction and replace it with 'any IRDA-registered insurer'.",
    },
    {
      clause_type: "EMI Bounce Charges",
      raw_text:
        "In case of dishonour of any EMI cheque or ECS mandate, the borrower shall pay a charge of ₹1,500 per instance plus GST.",
      extracted_value: 1500,
      extracted_unit: "₹ per instance",
      page_reference: "Page 4, Section 6.2",
      risk_level: "MEDIUM",
      benchmark_max: 500,
      benchmark_source: "RBI guidance: reasonable charges",
      is_above_benchmark: true,
      plain_english:
        "If your EMI payment fails for any reason—even once—you're charged ₹1,500 + 18% GST = ₹1,770. That's 3x the industry norm.",
      plain_hindi:
        "यदि किसी भी कारण से आपका EMI भुगतान विफल होता है, तो आप पर ₹1,500 + 18% GST = ₹1,770 का शुल्क लगाया जाता है।",
      plain_vernacular:
        "ನಿಮ್ಮ EMI ಪಾವತಿ ವಿಫಲವಾದರೆ, ₹1,500 + GST ಶುಲ್ಕ ವಿಧಿಸಲಾಗುತ್ತದೆ.",
      negotiation_tip: null,
    },
    {
      clause_type: "Property Insurance",
      raw_text:
        "The borrower agrees to insure the mortgaged property against fire, flood, and other natural calamities for the full replacement value.",
      extracted_value: null,
      extracted_unit: null,
      page_reference: "Page 6, Section 9.2",
      risk_level: "LOW",
      benchmark_max: null,
      benchmark_source: null,
      is_above_benchmark: false,
      plain_english:
        "You need to keep your home insured against fire and floods. This is standard and actually protects you too. The requirement is fair and legally sound.",
      plain_hindi:
        "आपको अपने घर को आग और बाढ़ से बीमा कराना होगा। यह मानक है और वास्तव में आपकी भी रक्षा करता है।",
      plain_vernacular:
        "ನಿಮ್ಮ ಮನೆಯನ್ನು ಬೆಂಕಿ ಮತ್ತು ಪ್ರವಾಹದ ವಿರುದ್ಧ ವಿಮೆ ಮಾಡಿಸಬೇಕು. ಇದು ಸಾಮಾನ್ಯ.",
      negotiation_tip: null,
    },
  ],
  critical_count: 2,
  high_count: 3,
  analyzed_at: new Date().toISOString(),
  suspicious: true,
  suspicious_flags: [
    "Interest rate 42% above current RBI benchmark",
    "Prepayment clause potentially violates RBI/2024-25/45",
    "Insurance bundling may breach IRDA tied-selling norms",
  ],
};

export const STARTER_QUESTIONS = [
  "What is the most risky clause in this document?",
  "Can I negotiate the interest rate?",
  "Is this prepayment penalty legal?",
  "What should I ask the bank before signing?",
];

export const LOADING_MESSAGES = [
  "Extracting document structure…",
  "Identifying financial clauses…",
  "Benchmarking against RBI guidelines…",
  "Calculating risk scores…",
  "Generating plain-language explanations…",
  "Preparing negotiation tips…",
  "Finalising your report…",
];
