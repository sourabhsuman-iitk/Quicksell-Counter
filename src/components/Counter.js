import firebase from 'firebase/compat/app'
import { updateDoc } from "firebase/firestore";
import 'firebase/compat/firestore'
import axios from 'axios'
import { useState, useEffect } from 'react'
import Display from './Display'
import Spinner from './Spinner'

firebase.initializeApp({
  apiKey: "AIzaSyCor0T-Q5ZovS59WNJMO4eV50lMYB97JgU",
  authDomain: "counter-quicksell.firebaseapp.com",
  projectId: "counter-quicksell",
  storageBucket: "counter-quicksell.appspot.com",
  messagingSenderId: "905168739659",
  appId: "1:905168739659:web:2fdf2bd2defb1b20009cce"
})

const db = firebase.firestore()

const putBaseURL = "https://interview-8e4c5-default-rtdb.firebaseio.com/front-end.json";
const getBaseURL = "https://interview-8e4c5-default-rtdb.firebaseio.com/front-end/sourabhsuman.json"

const Counter = () => {
    const[count,setCount] = useState(1)
    const[loading, setLoading] =useState(false)
    const[limit, setLimit] =useState(false)
    const[edited, setEdited] =useState(null)
    const MAX_VALUE=1000

    const countRef = db.collection('counter').doc('validCount');
    
    function updateDB(value){
        updateDoc(countRef, {
            val: value
          });
    }
    updateDB(count)

    const putCall = async () => {
        try {
            await axios
            .put(`${putBaseURL}`, {
                sourabhsuman : 101
            })
            .catch(error => {
                console.error('There was an error!', error)
            })
        } catch (err) {
            console.log(err)
        }
    }

    const getCall = async () => {
        try {
            await axios
                .get(`${getBaseURL}`)
                .then(response => {
                    updateDB(response.data)
                    setCount(response.data)
                    setLoading(true)
                })
                .catch(error => {
                    console.error('There was an error!', error)
                })
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() =>{
        putCall()
    }, [])

    useEffect(() => {
        getCall()
        // eslint-disable-next-line
    }, [])

    const validateForm = (e) => {
        if(e.target.value!=='' && e.target.value<=MAX_VALUE){
            setEdited(parseInt(e.target.value,10))
            setCount(parseInt(e.target.value))
            setLimit(false)
        } 
        else if(e.target.value>MAX_VALUE){
            setLimit(true)
        } 
    }
    const onSubmit = (e) => {
        e.preventDefault()
        if(edited!=='' && parseInt(edited)<=1000){
             setLimit(false)
        }
        setEdited('')
    }

    let current = count
    //in case get fetches null
    if(current==null)
        current = 1

    return (
        <>

        <div className="input-form">

            <form onSubmit={onSubmit}>
                <span id="label-form">Enter new counter value</span>
                <input type="number" id="input-counter" placeholder="Counter" value={edited} onChange={validateForm}/><br/>
                <input id="submit-btn" type="submit" value="Save"/>
            </form>

        </div>

        <div className="container">

            <div className="loading-display">
                {
                    limit ? <><div id="loading-text">Max limit reached</div> </> :
                    (null) 
                }
                { 
                    loading ? (null) : <>
                    <Spinner />
                    <div id="loading-text">Saving counter value</div>
                    </>
                }

            </div>

            <div className="button-wrapper">
                <button id="left-button" onClick={() =>{
                    setCount(count - 1)
                    setLimit(false)
                }}><span>-</span>
                </button>

                <h1 className="display-count"> 
                    <span>
                        {current}
                    </span>
                </h1>

                <button id="right-button" onClick={() =>{

                    if(current<MAX_VALUE)
                    setCount(count + 1)
                    else
                    setLimit(true)

                }}><span>+</span>
                </button>
            </div>

            <Display current={current}/>
        </div>
        </>
    )
}

export default Counter
