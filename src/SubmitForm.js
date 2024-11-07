import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SubmitForm = () => {
  const [assets, setAssets] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchAssets = async () => {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      setError('Token tidak ditemukan. Silakan login terlebih dahulu.');
      return;
    }

    try {
      const apiResponse = await fetch('https://api.numbersprotocol.io/api/v3/assets/', {
        method: 'GET',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (apiResponse.ok) {
        const data = await apiResponse.json();
        setAssets(data.results || []);
      } else {
        const errorData = await apiResponse.json();
        setError(errorData.message || 'Gagal mengambil daftar aset');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Terjadi kesalahan saat mengambil daftar aset.');
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleUseItemClick = (nid) => {
    navigate(`/asset-detail/${nid}`);
  };

  return (
    <div className="container mt-5">
      <h3>Your Registered Assets</h3>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      <div className="row">
        {Array.isArray(assets) && assets.length > 0 ? (
          assets.map((asset) => (
            <div className="col-md-4 mb-4" key={asset.id}>
              <div className="card h-100 d-flex flex-column">
                <img
                  src={asset.asset_file_thumbnail}
                  className="card-img-top"
                  alt="Asset Thumbnail"
                  style={{ height: '300px', objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{asset.headline || 'No Title'}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    {new Date(asset.uploaded_at).toLocaleString()}
                  </h6>
                  <div className="mt-auto">
                    <button
                      onClick={() => handleUseItemClick(asset.cid)}
                      className="btn btn-primary w-100 mb-2"
                    >
                      Use this item
                    </button>
                    <a
                      href={`https://verify.numbersprotocol.io/asset-profile/${asset.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary w-100"
                    >
                      Check on Numbers
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No assets available or failed to fetch assets.</p>
        )}
      </div>
    </div>
  );
};

export default SubmitForm;
