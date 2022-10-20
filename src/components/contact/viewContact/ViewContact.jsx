import React from 'react'
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom'
import axios from 'axios';

const ViewContact = () => {

    const { contactid } = useParams();

    let {isLoading,  data: contact, isError, error} = useQuery(['get-single-contact', contactid], async () => {
        return  await axios.get(`http://localhost:4000/contacts/${contactid}`);
     })
 

     const groupId = contact?.data?.groupId;
    

    let { data : groups} = useQuery(['get-single-group', groupId ], async () => {
        return  await axios.get(`http://localhost:4000/groups/${groupId}`,{
            enabled: !!groupId,
        });
     })

    

    if(isLoading){
        return <h3>Loading ..</h3>
    }

    if(isError){
        return <h3>{error.message}</h3>
    }

    return (
        <>

            <h2 className="mt-3 fw-bold">View Contact</h2>

            <div className='container bg-white shadow' style={{ width: "500px" }}>
             
                {
                   
                    <>
                        <div className="row d-flex align-items-center p-3">
                            <div className="col-md-4">
                                <img src={contact.data.photo} alt="userName" width={140} className="rounded" />
                            </div>
                            <div className="col-md-8">
                                <ul className="list-group">
                                    <li className="list-group-item">Name: <span className="fw-bold">{contact.data.name}</span></li>
                                    <li className="list-group-item">Phone: <span className="fw-bold">{contact.data.mobile}</span></li>
                                    <li className="list-group-item">Email: <span className="fw-bold">{contact.data.email}</span></li>
                                    <li className="list-group-item">Group: <span className="fw-bold">{JSON.stringify(groups?.data?.name)}</span></li>
                                </ul>
                            </div>
                        </div>
                    </>
                }
            </div>
        </>

    )
}

export default ViewContact