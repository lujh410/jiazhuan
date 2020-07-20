const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    return await db.collection(event.dbname).where({
      course_id:event.course_id,
      _openid:event.openid
    }).remove()
  } catch(e) {
    console.error(e)
  }
}