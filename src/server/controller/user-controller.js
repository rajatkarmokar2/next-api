

import path from 'path';
import { promises as fs } from 'fs';
import { v4 as uuidv4,validate as uuidValidate } from 'uuid';

// controller functions
export async function getUsers ( req,res ) {
    const { limit,page,select,search } = req.query
    try {
        let data = await readFileData()
        if ( select ) data = data.map( d => {
            const data = {}
            select.split( ',' ).map( s => data[ s ] = d[ s ] )
            return data
        } )
        if ( search ) data = data.filter(d=>
            search.split(',').find(s=>d[s.split('=')[0]]==s.split('=')[1])
        )
        res.status( 200 ).json( { limit,page,select,data } )
    } catch ( err ) {
        res.status( 500 ).send( 'something went wrong' )
    }
}
export async function postUsers ( req,res ) {
    try {
        const { body } = req
        const data = await readFileData() || []
        if ( body ) {
            data.push( {
                id: uuidv4(),
                ...body,
            } )
            await writeFileData( data )
        }
        res.status( 200 ).json( { data } )
    } catch ( err ) {
        res.status( 500 ).send( err.message )
    }
}
export async function patchUsers ( req,res ) {
    try {
        const { query: { id },body } = req
        let data = await readFileData()
        if ( !uuidValidate( id ) && !body ) return res.status( 404 ).send( 'bad request' )
        data = data.map( d => d.id === id && { id,...body } || d )
        await writeFileData( data )
        res.status( 200 ).json( { data } )
    } catch ( err ) {
        res.status( 500 ).send( 'something went wrong' )
    }
}
export async function deleteUsers ( req,res ) {
    try {
        const { query: { id } } = req
        let data = await readFileData()
        if ( !uuidValidate( id ) ) return res.status( 404 ).send( 'bad request' )
        data = data.filter( d => d.id !== id )
        await writeFileData( data )
        res.status( 200 ).json( { data } )
    } catch ( err ) {
        res.status( 500 ).send( 'something went wrong' )
    }
}

// helper functions
async function readFileData () {
    const jsonDirectory = path.join( process.cwd(),'src/server/' );
    const jsondata = await fs.readFile( jsonDirectory + '/data.json','utf8' );
    const data = JSON.parse( jsondata )
    return data
}

async function writeFileData ( data ) {
    const jsonDirectory = path.join( process.cwd(),'src/server/' );
    await fs.writeFile( jsonDirectory + '/data.json',JSON.stringify( data ),( err ) => {
        if ( err ) console.log( err );
        console.log( "Successfully Written to File." );
    } );
}
