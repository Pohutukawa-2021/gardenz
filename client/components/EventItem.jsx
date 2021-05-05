import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toggleVolunteerStatus } from '../pages/eventHelper'

export default function EventItem ({ event, isAdmin }) {
  const { id, title, date, volunteersNeeded, description, totalVolunteers, isVolunteer } = event
  const [isVolunteering, setIsVolunteering] = useState(isVolunteer)
  const remainingVolunteers = volunteersNeeded - totalVolunteers
  const additionalVolunteers = Math.abs(remainingVolunteers)

  function clickHandler () {
    return toggleVolunteerStatus(id, isVolunteering)
      .then((wasSuccessful) => {
        if (wasSuccessful) {
          setIsVolunteering(!isVolunteering)
        }
        return null
      })
  }

  return (
    <article className='box my-5'>
      <div className="is-flex">
        <h2 className='title is-5 is-flex-grow-1'>
          <Link className='title-link' to={`/events/${id}`}>{title}</Link>
        </h2>
        {isAdmin
          ? <Link to={`/events/${id}/edit`} className='button'>Edit Event</Link>
          : !isVolunteering
            ? <button onClick={clickHandler} className='button'>Volunteer</button>
            : <button onClick={clickHandler} className='button'>Un-Volunteer</button>
        }
      </div>
      <p>{date}</p>
      {remainingVolunteers >= 0
        ? <p>{remainingVolunteers} out of {volunteersNeeded} volunteers needed</p>
        : <p>0 out of {volunteersNeeded} volunteers needed (currently {additionalVolunteers} extra)</p>
      }
      <p>{description}</p>
    </article>
  )
}
