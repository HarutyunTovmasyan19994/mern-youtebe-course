import {Router} from "express"
import Link from "../modules/Link.js"

const router = Router()


router.get('/:code',async (req, res)=>{
try {
    const links = await  Link.findOne({code:req.params.code})
    console.log(links)
    if(links){
        links.clicks++
        await links.save()
        return res.redirect(links.from)
    }
    res.status(404).json("Link not Found")


} catch (e) {
    res.status(500).json({message: "incorrect password, again too"})
}
})

export default router
