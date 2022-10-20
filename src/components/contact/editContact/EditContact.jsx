import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useMutation, useQuery } from 'react-query';
import { Link, useParams, useNavigate } from 'react-router-dom'

const EditContact = () => {
    const { contactid } = useParams();
    const navigate = useNavigate();
    const [contact, setContact] = useState({
        "name": "",
        "mobile": "",
        "email": "",
        "photo": "",
        "groupId": ""
    });

    const { isLoading, isError, error, data: contactData } = useQuery('get-edit-single-contact', () => {
        return axios.get(`http://localhost:4000/contacts/${contactid}`)
    })

    const { data: groupData } = useQuery('get-all-groups', () => {
        return axios.get(`http://localhost:4000/groups`);
    })

    const { mutate: editContact } = useMutation((contact) => {
        return axios.put(`http://localhost:4000/contacts/${contactid}`, contact)
    }, {
        onSuccess: () => {
            navigate('/contact/list', { replace: true });
        },
        onError: () => {
            navigate(`/contact/edit/${contactid}`, { replace: false })
        }
    })


    let handleInputChange = (e) => {
        setContact({
            ...contact,
            [e.target.name]: e.target.value
        })
    }



    let handleFormSubmit =  (e) => {
        e.preventDefault();
        editContact(contact);
    }


    if (isLoading) {
        return <h2>Loading</h2>
    }

    if (isError) {
        return <h2>{error.message}</h2>
    }


    return (
        <div className='container bg-white shadow'>
              <pre>{JSON.stringify(contact)}</pre>
            {
              
                <div className="row d-flex align-items-center">
                    <div className="col-md-8">
                        <form onSubmit={handleFormSubmit} className="form  p-3 pb-5 mt-5">
                            <h2 className="fw-bold mt-2">Edit Contact</h2>

                            <div className="form-group mt-4">
                                <label htmlFor="name">Name</label>
                                <input type="text" name='name' defaultValue={contactData?.data?.name} onChange={handleInputChange} id="name" className="form-control" />
                            </div>
                            <div className="form-group mt-4">
                                <label htmlFor="Phone">Phone</label>
                                <input type="number" name='mobile' defaultValue={contactData?.data?.mobile} onChange={handleInputChange} id="Phone" className="form-control" />
                            </div>
                            <div className="form-group mt-4">
                                <label htmlFor="Email">Email</label>
                                <input type="email" name='email' defaultValue={contactData?.data?.email} onChange={handleInputChange} id="Email" className="form-control" />
                            </div>
                            <div className="form-group mt-4">
                                <label htmlFor="Image">Image URL</label>
                                <input type="text" name='photo' defaultValue={contactData?.data?.photo} onChange={handleInputChange} id="Image" className="form-control" />
                            </div>
                            <div className="form-group mt-4">
                                <select name="groupId" defaultValue={contactData?.data?.groupId} id="groupId" onChange={handleInputChange} className="form-control">
                                    <option>Select Group</option>
                                    {
                                        groupData?.data?.map((group) => {
                                            return <option key={group.id} defaultValue={group.id}>{group.name}</option>
                                        })
                                    }
                                </select>
                            </div>

                            <div className="d-felx mt-5 ms-auto">
                                <button className="btn btn-outline-primary m-2">Edit</button>
                                <Link to="/contact/list" className="btn btn-outline-danger">Cancel</Link>
                            </div>
                        </form>
                    </div>
                    <div className="col-md-4">
                        <img src={contactData?.data?.photo} alt="userName" width={300} className="rounded" />
                    </div>
                </div>
            }
        </div>
    )
}

export default EditContact