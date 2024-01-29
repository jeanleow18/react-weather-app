const AlertComponent = ({ variant, message }) => {
  return (
    <div className={`alert alert-${variant}`} role="alert">
      {message}
    </div>
  );
};

export default AlertComponent;
