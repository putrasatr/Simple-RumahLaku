const isLoggedin = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/signin')
  }
  // res.redirect('/')
}
function makeid(p, t) {
  const n = Math.random() * 100000 | 0
  const s = n.toString(36)
  p--
  if (p) return makeid(p, (t + s))
  const d = new Date()
  const formatDate = `[${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}]-`
  const id = formatDate + t + s + ".jpeg"
  return id
}
module.exports = { isLoggedin, makeid }