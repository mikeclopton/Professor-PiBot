import React from 'react';

const Output = ({ response }) => {
  return (
    <div>
      <h2>Results Here</h2>
      {response ? <p>{response}</p> : <p>Output will be shown here...</p>}
    </div>
  );
};

export default Output;
