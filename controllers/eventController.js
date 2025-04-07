const Event = require("../models/eventModel");
const NodeCache = require('node-cache');
const eventsCache = new NodeCache({ stdTTL: 3600 }); // 1 hour TTL

const createEvent = async function (req, res) {
    try {
        // Create a new event
        const event = await Event.insertOne(
            {
                name: req.body.name, 
                organizers: [req.user._id], 
                dateFrom: req.body.dateFrom, 
                dateTo: req.body.dateTo,
                place: req.body.place,
                description: req.body.description,
                maxParticipants: req.body.maxParticipants,
                status: req.body.status,

            }
        );
        res.status(200).json({message: "Successfully created the event", event});
    } catch (err) {
        console.log(`Error occured in: . Error e: ${err}`);
        return res.status(400).json({ message: 'Something went wrong'});
    }
} 

const getAllEvents = async function (req, res) {
    try {
        // Check if the events exists in the cache
        let events = eventsCache.get( "allEvents" );

        if (events) {
            return res.status(200).json({ events });
        }

        // Fetch all the events if not in cache
        events = await Event.find()
                    .populate('organizers', 'name -_id') // Populate the organizer name and remove id
                    .populate('participants', 'name -_id'); // Populate the participant name and remove id
        
        // Store all the events in the cache
        const plainEvents = events.map(doc => doc.toObject());
        eventsCache.set("allEvents", plainEvents);
        
        res.status(200).json({ events });
    } catch (err) {
        console.log(`Error occured in: . Error e: ${err}`);
        return res.status(400).json({ message: 'Something went wrong'});
    }
}

const getEvent = async function (req, res) {
    try {
        let eventId = req.params.id;

        // Check if the events exists in the cache
        let event = eventsCache.get( eventId );

        if (event) {
            return res.status(200).json({ event });
        }

        // Fetch the event from the db if doesn't exist in cache
        event = await Event.findOne({ _id: eventId })
                .populate('organizers', 'name -_id') // Populate the organizer name and remove id
                .populate('participants', 'name -_id') // Populate the participant name and remove id
                .lean(); // Makes it plain JS object — ideal for caching

        if (!event) {
            return res.status(401).json({ message: "Requested event doesn't exist" });
        }

        // Set the event in the cache
        eventsCache.set(eventId, event);

        return res.status(200).json({ event });
    } catch (err) {
        console.log(`Error occured in: . Error e: ${err}`);
        return res.status(400).json({ message: 'Something went wrong'});
    }
}

const updateEvent = async function (req, res) {
    try {
        const eventId = req.params.id;

        const updatedEvent = await Event.findOneAndUpdate(
            { _id: eventId },
            {
                name: req.body.name,
                dateFrom: req.body.dateFrom,
                dateTo: req.body.dateTo,
                place: req.body.place,
                description: req.body.description,
                maxParticipants: req.body.maxParticipants,
                status: req.body.status,
            },
            {
                new: true,          // Return the updated document
                runValidators: true // Ensure validation rules are enforced
            }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Delete the event in the cache
        eventsCache.del(eventId);

        // Delete the all event cache
        eventsCache.del("allEvents");

        res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
    } catch (err) {
        console.error(`Error occurred while updating event: ${err}`);
        return res.status(400).json({ message: 'Something went wrong' });
    }
}

const registerForEvent = async function (req, res) {
    try {
        // Register for an event
        const user = req.user;
        const eventId = req.params.id;

        const event = await Event.findById(eventId);
    
        if (!event) {
          return res.status(404).send({ message : 'Event does not exist'});
        }

        // Add user to participants if not already added
        if (event.participants.includes(user._id)) {
            return res.status(400).send({ message: 'User already registered for this event' });
        }
  
        event.participants.push(user._id);  // Register user to event
        await event.save();

        // Add the event to the user's registeredEvents list
        user.registeredEvents.push(eventId);
        await user.save();  // Save the updated user profile
    
        res.status(200).send({ message: 'User successfully registered for the event' });
    } catch (err) {
        console.log(`Error occured in: . Error e: ${err}`);
        return res.status(400).json({ message: 'Something went wrong'});
    }
}

const deleteEvent = async function (req, res) {
    try {
        // Delete the event
        const eventId = req.params.id;

        const result = await Event.deleteOne({ _id: eventId });

        if (result.deletedCount === 1) {
            eventsCache.del(eventId);
            eventsCache.del("allEvents");
            return res.status(200).send({ message: 'Document deleted successfully' });
        } else {
            return res.status(404).send({ message: 'Document not found' });
        }
    } catch (err) {
        console.log(`Error occured in deleting the event. Error e: ${err}`);
        return res.status(400).json({ message: 'Something went wrong'});
    }
}


module.exports = { createEvent, getAllEvents, getEvent, updateEvent, registerForEvent, deleteEvent };