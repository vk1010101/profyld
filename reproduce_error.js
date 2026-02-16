
async function reproduce() {
    try {
        const response = await fetch('http://localhost:3000/api/parse-cv', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cvUrl: "C:\\Users\\Vidit\\Downloads\\Vidit Kohli - resume (revised with CSOS projects).pdf"
            })
        });

        console.log('Status:', response.status);
        const text = await response.text();
        console.log('Body:', text);
    } catch (err) {
        console.error('Error:', err);
    }
}

reproduce();
