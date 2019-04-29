const Ad = require('../models/Ad')
const User = require('../models/User')
const Purchase = require('../models/Purchase')
const PurchaseMail = require('../jobs/PurchaseMail')
const Queue = require('../services/Queue')

class PurchaseController {
  async store (req, res) {
    const { ad, content } = req.body

    const purchaseAd = await Ad.findById(ad).populate('author')
    const user = await User.findById(req.userId)

    const purchase = await Purchase.create({
      content,
      ad,
      user: user._id
    })

    Queue.create(PurchaseMail.key, {
      ad: purchaseAd,
      user,
      content
    }).save()

    return res.json(purchase)
  }

  async accept (req, res) {
    const { id } = req.params

    const { ad } = await Purchase.findById(id).populate({
      path: 'ad',
      populate: {
        path: 'author'
      }
    })

    if (!ad.author._id.equals(req.userId)) {
      return res
        .status(401)
        .json({ error: 'You do not have access to this Ad.' })
    }

    // if (ad.author._id.equals(req.userId)) {
    //   return res.status(401).json({
    //     error:
    //       'This Ad belongs to you. Please use other options if you wish to cancel the Ad.'
    //   })
    // }

    if (!ad || ad.purchasedBy !== null) {
      return res
        .status(400)
        .json({ error: 'Ad does not exit or already over.' })
    }

    ad.purchasedBy = id

    await ad.save()

    return res.json(ad)
  }
}

module.exports = new PurchaseController()
