export const dataSecurityConfig = {
  title: "Data Security Audit Checklist",
  category: "Compliance",
  frequency: "Scheduled",
  targetScore: 90,
  questions: [
    // Staff
    {
      id: 1,
      section: "Staff Responsibility & Training",
      question: "Spot check that staff understand their responsibility towards data security."
    },
    {
      id: 2,
      section: "Staff Responsibility & Training",
      question: "Spot check that staff are aware of our data protection policies."
    },
    {
      id: 3,
      section: "Staff Responsibility & Training",
      question: "Have staff received training on data protection?"
    },
    {
      id: 4,
      section: "Staff Responsibility & Training",
      question: "Have any staff undergone disciplinary action in relation to data protection and security?"
    },
    {
      id: 5,
      section: "Staff Responsibility & Training",
      question: "Spot check that staff understand how to report security breaches and near misses."
    },

    // Physical Access to hardcopy records
    {
      id: 6,
      section: "Physical Access",
      question: "Check the record of which staff have access to confidential areas is up to date."
    },
    {
      id: 7,
      section: "Physical Access",
      question: "Are all offices, files, or cabinets which contain confidential information kept locked when not in use?"
    },
    {
      id: 8,
      section: "Physical Access",
      question: "Has all confidential waste been disposed of securely and are there destruction certificates? (If applicable)"
    },
    {
      id: 9,
      section: "Physical Access",
      question: "Has anyone inappropriately accessed, or attempted to access, confidential hardcopy records?"
    },

    // Digital Access to records
    {
      id: 10,
      section: "Digital Access",
      question: "Is the allocation of administrator rights restricted?"
    },
    {
      id: 11,
      section: "Digital Access",
      question: "Have staff access rights been reviewed?"
    },
    {
      id: 12,
      section: "Digital Access",
      question: "Check if there is any evidence of staff sharing access rights."
    },
    {
      id: 13,
      section: "Digital Access",
      question: "Are screens locked when not in use?"
    },
    {
      id: 14,
      section: "Digital Access",
      question: "Check that our password policy is being followed."
    },
    {
      id: 15,
      section: "Digital Access",
      question: "Has anyone inappropriately accessed, or attempted to access, confidential digital records?"
    },
    {
      id: 16,
      section: "Digital Access",
      question: "Have appropriate security measures been applied to all computers, laptops and mobile devices?"
    },
    {
      id: 17,
      section: "Digital Access",
      question: "Are staff using computers appropriately (e.g. no personal use, no downloading unapproved software, no social media use etc.)?"
    },

    // Sharing data
    {
      id: 18,
      section: "Sharing Data",
      question: "Are our procedures for safely sharing personal information via post being followed?"
    },
    {
      id: 19,
      section: "Sharing Data",
      question: "Are our procedures for safely sharing personal information via fax being followed?"
    },
    {
      id: 20,
      section: "Sharing Data",
      question: "Are our procedures for safely sharing personal information via secure email being followed?"
    },

    // Legal Checks
    {
      id: 21,
      section: "Legal Checks",
      question: "Has the Information Asset Register been reviewed and signed off?"
    },
    {
      id: 22,
      section: "Legal Checks",
      question: "Has the Record of Processing Activities been reviewed and signed off?"
    },
    {
      id: 23,
      section: "Legal Checks",
      question: "Are records of consent up to date and still applicable?"
    }
  ]
};
