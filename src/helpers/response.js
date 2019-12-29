exports.sendCreated = function(res, data) {
  return res.status(201).send(data);
};

exports.sendBadRequest = function(res, message) {
  return res.status(400).send({
    success: false,
    message: message,
    res: JSON.stringify(res, getCircularReplacer())
  });
};

exports.sendUnauthorized = function(res, message) {
  return res.status(401).send({
    success: false,
    message: message,
    res: JSON.stringify(res, getCircularReplacer())
  });
};

exports.sendForbidden = function(res) {
  return res.status(403).send({
    success: false,
    message: "You do not have rights to access this resource.",
    res: JSON.stringify(res, getCircularReplacer())
  });
};

exports.sendNotFound = function(res) {
  return res.status(404).send({
    success: false,
    message: "Resource not found.",
    res: JSON.stringify(res, getCircularReplacer())
  });
};

exports.setHeadersForCORS = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, X-Access-Token, Content-Type, Accept"
  );
  next();
};

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};
