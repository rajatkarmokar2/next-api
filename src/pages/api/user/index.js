// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getUsers,postUsers } from "../../../server/controller/user-controller"



export default function ( req,res ) {
    const { method } = req
    if ( method === 'GET' ) getUsers( req,res )
    else if ( method === 'POST' ) postUsers( req,res )
    else {
        res.status( 404 ).send( '404 not found' )
    }
}


