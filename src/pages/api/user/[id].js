
// export default function handler(req,res){
//     const {query}=req
//     res.status(200).json({query})
// }

import { deleteUsers,patchUsers } from "../../../server/controller/user-controller"

export default function ( req,res ) {
    const { method } = req
    if ( method === 'PATCH' ) patchUsers( req,res )
    else if ( method === 'DELETE' ) deleteUsers( req,res )
    else {
        res.status( 404 ).send( '404 not found' )
    }
}