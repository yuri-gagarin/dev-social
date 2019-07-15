export default function(err, req, res, next) {
  if (res.headersSent) {
    console.log("error")
    return next(err);
  }
}