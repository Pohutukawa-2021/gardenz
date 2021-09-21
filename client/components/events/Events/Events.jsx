import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import EventItem from '../EventItem/EventItem'

export default function Events ({ gardenid, events }) {
  const isAdmin = useSelector(globalState => globalState.user.isAdmin)

  return (
    <>
      <h1 className='events-title'>Events</h1>
      <section className='column-9 scroll'>
        {events.map((event) =>
          <EventItem key={event.id} gardenid={gardenid} event={event} isAdmin={isAdmin} />
        )}
      </section>
      <div>
        {
          isAdmin
            ? <Link to='/event/new' className='button'>Add New Event</Link>
            : null
        }
      </div>
    </>
  )
}
