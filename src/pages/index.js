import Head from 'next/head'
import { Inter } from 'next/font/google'
import { useEffect,useState } from 'react'

const inter = Inter( { subsets: [ 'latin' ] } )

const initUserDatas = {
  name: { value: '',error: '' },
  age: { value: '',error: '' },
  city: { value: '',error: '' },
}
export default function Home () {
  const [ userData,setUserData ] = useState( null )
  const [ userInputs,setUserInputs ] = useState( initUserDatas )
  const [ isEditUser,setIsEditUser ] = useState( null )

  useEffect( () => {
    getUsers()
  },[] );
  function onChangeUser ( e ) {
    const { name,value } = e.target
    setUserInputs( ps => ( { ...ps,[ name ]: { ...ps[ name ],value } } ) )
    console.log( name,userInputs )
  }
  async function getUsers () {
    const res = await fetch( '/api/user' )
    const data = await res.json()
    setUserData( [ ...data.data ] )
    console.log( data )
  }
  async function onEditUser ( id ) {
    setIsEditUser( id )
    const data = userData.find( d => d.id === id )
    setUserInputs( {
      name: { value: data.name,error: '' },
      age: { value: data.age,error: '' },
      city: { value: data.city,error: '' },
    } )
  }
  async function onDeleteUser ( id ) {
    const res = await fetch( '/api/user/' + id,{ method: 'DELETE' } )
    const data = await res.json()
    setUserData( [ ...data.data ] )
    console.log( data )
  }
  async function onSubmit ( e ) {
    e.preventDefault()
    const raw = {
      name: userInputs.name.value,
      age: userInputs.age.value,
      city: userInputs.city.value,
    }
    const requestOptions = {
      method: !isEditUser && 'POST' || 'PATCH',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify( raw ),
      redirect: 'follow'
    };
    console.log( raw )
    try {
      const res = await fetch( '/api/user/' + (isEditUser || '') || id,requestOptions )
      const data = await res.json()
      setUserData( [ ...data.data ] )
      setIsEditUser( null )
      setUserInputs( initUserDatas )
      console.log( data )
    } catch ( error ) {
      console.log( error )
    }
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='bg-black text-white min-vh-100'>
        <main className='container-xxl p-1 px-3'>
          {/* form */ }
          <form onSubmit={ onSubmit } className='card col-md-6 mx-auto bg-success text-white my-3'>
            <div className='card-body row gy-3 row-cols-1 row-cols-sm-2'>
              <div className='col'>
                <label className='form-label' htmlFor="">Name</label>
                <input className='form-control' type="text" onChange={ onChangeUser } name='name' value={ userInputs.name.value } />
              </div>
              <div className='col'>
                <label className='form-label' htmlFor="">Age</label>
                <input className='form-control' type="text" onChange={ onChangeUser } name='age' value={ userInputs.age.value } />
              </div>
              <div className='col'>
                <label className='form-label' htmlFor="">City</label>
                <input className='form-control' type="text" onChange={ onChangeUser } name='city' value={ userInputs.city.value } />
              </div>
            </div>
            <div className='card-footer bg-success-subtle py-3 text-end'>
              { isEditUser && <button className='btn btn-outline-success px-4 mx-3' type='button' onClick={ () => { setIsEditUser( false ); setUserInputs( initUserDatas ) } }>Cancel</button> }
              <button className='btn btn-success px-4'>{ !isEditUser && 'Submit' || 'Update' }</button>
            </div>
          </form>
          {/* search */ }
          <div className='d-flex flex-wrap align-items-center mt-3 rounded-top bg-success px-3'>
            <div>
              <h4>USERS</h4>
            </div>
            <div className='ms-auto'>
              <div className="input-group">
                {/* <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span> */}
                <span className="input-group-text bg-success border-0">
                  <select className='form-select' name="" id="">
                    <option value="">All</option>
                    <option value="">Name</option>
                    <option value="">Age</option>
                    <option value="">City</option>
                  </select>
                </span>
                <span className="input-group-text bg-success border-0">
                  <input type="text" className="form-control" placeholder="Search" />
                </span>
                <span className="input-group-text bg-success border-0 p-0">
                  <button className='btn btn-lg'><i className="bi bi-search text-white"></i></button>
                </span>
              </div>
            </div>
          </div>
          {/* table */ }
          <table className='table table-bordered table-hover'>
            <thead className='bg-success text-white'>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>City</th>
                <th className='col-1'>Actions</th>
              </tr>
            </thead>
            <tbody className='bg-success-subtle'>
              { !userData && <tr className='table-light'><td colSpan='3'>loading...</td></tr> ||
                userData.map( v => (
                  <tr key={ v.id }>
                    <td> { v.name }
                    </td>
                    <td>{ v.age }
                    </td>
                    <td>{ v.city }
                    </td>
                    <td>
                      <div className='d-flex gap-2'>
                        <button className='btn btn- sm border'><i className="bi bi-pencil" onClick={ () => onEditUser( v.id ) }></i></button>
                        <button className='btn btn- sm border'><i className="bi bi-x-lg" onClick={ () => onDeleteUser( v.id ) }></i></button>
                      </div>
                    </td>
                  </tr>
                ) )
              }
            </tbody>
          </table>
        </main>
      </div>
    </>
  )
}

