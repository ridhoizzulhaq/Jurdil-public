// PollSummary.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PollSummary = () => {
  const [pollData, setPollData] = useState([]);
  const [totals, setTotals] = useState({ candidate1: 0, candidate2: 0, candidate3: 0 });
  const [locationInfo, setLocationInfo] = useState({});
  const [error, setError] = useState(null);

  // Helper function to format long strings
  const formatLongText = (text, startLength = 6, endLength = 6) => {
    if (text.length <= startLength + endLength) return text;
    return `${text.slice(0, startLength)}...${text.slice(-endLength)}`;
  };

  const fetchLocationInfo = async (postalCode, pollId) => {
    try {
      const response = await axios.get(`https://kodepos.vercel.app/search/?q=${postalCode}`);
      if (response.data.statusCode === 200 && response.data.data.length > 0) {
        setLocationInfo(prev => ({
          ...prev,
          [pollId]: {
            village: response.data.data[0].village,
            district: response.data.data[0].district,
            regency: response.data.data[0].regency,
            province: response.data.data[0].province,
          },
        }));
      } else {
        console.error('Location information not found for postal code:', postalCode);
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
  };

  useEffect(() => {
    const fetchPollData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/getPolls');
        const data = response.data;

        const totalCandidate1 = data.reduce((acc, poll) => acc + poll.candidate1_votes, 0);
        const totalCandidate2 = data.reduce((acc, poll) => acc + poll.candidate2_votes, 0);
        const totalCandidate3 = data.reduce((acc, poll) => acc + poll.candidate3_votes, 0);

        setTotals({ candidate1: totalCandidate1, candidate2: totalCandidate2, candidate3: totalCandidate3 });
        setPollData(data);

        data.forEach(poll => {
          const postalCode = poll.poll_id.toString().slice(0, 5);
          fetchLocationInfo(postalCode, poll.poll_id);
        });
      } catch (error) {
        setError('Error fetching poll data');
        console.error(error);
      }
    };

    fetchPollData();
  }, []);

  // Data for the pie chart
  const pieData = {
    labels: ['Candidate 1', 'Candidate 2', 'Candidate 3'],
    datasets: [
      {
        label: 'Total Votes',
        data: [totals.candidate1, totals.candidate2, totals.candidate3],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
    <div className="container mt-5">
      <h3>Poll Summary</h3>
      {error && <p className="text-danger">{error}</p>}

      <div className="mb-4">
        <h5>Total Votes</h5>
        <div style={{ width: '200px', margin: '0 auto' }}>
          <Pie data={pieData} />
        </div>
      </div>

      <table className="table mt-3">
        <thead>
          <tr>
            <th>Polling Palace Information</th>
            <th>Transaction Hash</th>
            <th>NID (Please Click for Full Image Information on Capture)</th>
            <th>Candidate 1 Votes</th>
            <th>Candidate 2 Votes</th>
            <th>Candidate 3 Votes</th>
          </tr>
        </thead>
        <tbody>
          {pollData.map((poll) => {
            const postalCode = poll.poll_id.toString().slice(0, 5);
            const pollingPalace = parseInt(poll.poll_id.toString().slice(5), 10);
            const location = locationInfo[poll.poll_id] || {};

            return (
              <tr key={poll.poll_id}>
                <td>
                  <p>
                    <strong>Poll ID:</strong> {poll.poll_id} <br />
                    {location.village && (
                      <>
                        <strong>Location:</strong> {location.village}, {location.district}, {location.regency}, {location.province} <br />
                      </>
                    )}
                    <strong>Polling Palace:</strong> {pollingPalace}
                  </p>
                </td>
                <td>
                  <a
                    href={`https://testnet.num.network/search-results?q=${poll.transaction_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {formatLongText(poll.transaction_hash, 6, 6)}
                  </a>
                </td>
                <td>
                  <a
                    href={`https://verify.numbersprotocol.io/asset-profile/${poll.nid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {formatLongText(poll.nid, 6, 6)}
                  </a>
                </td>
                <td>{poll.candidate1_votes}</td>
                <td>{poll.candidate2_votes}</td>
                <td>{poll.candidate3_votes}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PollSummary;
