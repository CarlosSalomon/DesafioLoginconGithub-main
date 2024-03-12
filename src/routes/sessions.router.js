import { Router } from "express";
import passport from "passport";
export const router = Router()


router.get( '/github',passport.authenticate("github",{}),(req, res)=>{});

router.get( '/callbackGithub',passport.authenticate("github",{}),(req, res) => {
    req.session.user=req.user

    res.setHeader('Content-Type','application/json');
    return res.redirect('/productos')
});

