/**
 * Defines the structure for a single document object.
 */
export interface Document {
    id: number;
    title: string;
    type: 'Sales Agreement' | 'Marketing Copy' | 'Market Report' | 'Email Template';
    date: string;
    content: string; // Content can contain markdown-like syntax
}

// Mock data for demonstration purposes.
export const mockDocuments: Document[] = [
    {
        id: 1,
        title: 'Palm Jumeirah Villa - Sales Agreement Draft',
        type: 'Sales Agreement',
        date: '2024-07-28',
        content: `**SALES AND PURCHASE AGREEMENT**

This agreement is made on this 28th day of July, 2024.

BETWEEN:
Mr. Khan (the "Seller")
AND
[Buyer Name] (the "Buyer")

**TERMS:**
1. A deposit of 10% (AED 1,200,000) shall be paid upon signing.
2. The remainder shall be paid upon transfer of title.
3. RERA and DLD fees to be shared equally between both parties.

For official guidelines, please refer to the [DLD website](https://dubailand.gov.ae/).`
    },
    {
        id: 2,
        title: 'Downtown Dubai 2BR Apartment Listing',
        type: 'Marketing Copy',
        date: '2024-07-27',
        content: `**Luxury 2-Bedroom Apartment with Full Burj Khalifa View in Downtown Dubai**

Experience the height of luxury in this stunning 2-bedroom apartment. Offering breathtaking, unobstructed views of the Burj Khalifa.

**Key Features:**
- 2 Spacious Bedrooms with En-suite Bathrooms
- 1,650 sq. ft. of living space
- Floor-to-ceiling windows
- Modern, fully-equipped kitchen

**Price: AED 3,500,000** For more details, [visit our website](https://example.com).`
    },
    {
        id: 3,
        title: 'Weekly Market Report - July Week 4',
        type: 'Market Report',
        date: '2024-07-26',
        content: `**Dubai Real Estate Market Report - Week 4, July 2024**

**Key Highlights:**
- **Palm Jumeirah:** Rental yields have seen a 3% increase.
- **Dubai Marina:** Sales transactions are up by 15% month-on-month.
- **Expo City Dubai:** The launch of the new "Mangrove Residences" has attracted significant interest.`
    },
    {
        id: 4,
        title: 'Automated Follow-up Email Script',
        type: 'Email Template',
        date: '2024-07-25',
        content: `**Subject: Following up on your interest in Downtown Dubai**

Hi [Client Name],

Following up on our recent conversation. Here is a small script to showcase properties dynamically:

\`\`\`javascript
function displayProperties(properties) {
  const container = document.getElementById('property-listings');
  container.innerHTML = ''; // Clear previous listings
  
  properties.forEach(prop => {
    const card = document.createElement('div');
    card.className = 'property-card';
    card.innerHTML = \`
      <h3>\${prop.title}</h3>
      <p>Price: \${prop.price}</p>
    \`;
    container.appendChild(card);
  });
}
\`\`\`

Let me know when would be a good time to discuss these.

Best regards,
Sarah`
    }
];
