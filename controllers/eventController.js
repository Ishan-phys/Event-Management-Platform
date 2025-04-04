const Event = require("../models/eventModel");

const createEvent = async function (req, res) {
    try {
        const user = req.user;

        // Only for organizer role should be able to create an event
        if (!user.roles.includes('organizer')) {
            return res.status(500).json({ message: "User is not authorized to create a new event" });
        }

        // Insert the new event in the db
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
        res.status(500).json({message: "Error occured in creating the event"});
    }
} 

const getAllEvents = async function (req, res) {
    try {
        // Fetch all the events from db
        const events = await Event.find()
                        .populate('organizers', 'name -_id') // Populate the organizer name and remove id
                        .populate('participants', 'name -_id'); // Populate the participant name and remove id
        res.status(200).json({ events });
    } catch (err) {
        console.log(`Error occured in: . Error e: ${err}`);
    }
}

const getEvent = async function (req, res) {
    try {
        let eventId = req.params.id;

        // Fetch the particular event 
        const event = await Event.findOne({ _id: eventId })
                                .populate('organizers', 'name -_id') // Populate the organizer name and remove id
                                .populate('participants', 'name -_id'); // Populate the participant name and remove id

        if (!event) {
            return res.status(401).json({ message: "Requested event doesn't exist" });
        }
        return res.status(200).json({ event });
    } catch (err) {
        console.log(`Error occured in: . Error e: ${err}`);
    }
}

const updateEvent = async function (req, res) {
    try {
        // Only for organizer role
    } catch (err) {
        console.log(`Error occured in: . Error e: ${err}`);
    }
}

const registerForEvent = async function (req, res) {
    try {
        // Only for registrant roles
        const user = req.user;
        const eventId = req.params.id;

        const event = await Event.findById(eventId);
    
        if (!user || !event) {
          return res.status(404).send('User or Event not found');
        }

        // Add user to participants if not already added
        if (event.participants.includes(user._id)) {
            return res.status(400).send('User already registered for this event');
        }
  
        event.participants.push(user._id);  // Register user to event
        await event.save();

        // Add the event to the user's registeredEvents list
        user.registeredEvents.push(eventId);
        await user.save();  // Save the updated user profile
    
        res.status(200).send('User successfully registered for the event');
    } catch (err) {
        console.log(`Error occured in: . Error e: ${err}`);
    }
}

const deleteEvent = async function (req, res) {
    try {
        let eventId = req.params.id;

        // Delete the document
        const result = await collection.deleteOne({ _id: eventId });

        if (result.deletedCount === 1) {
            return res.status(200).send({ message: 'Document deleted successfully' });
        } else {
            return res.status(404).send({ message: 'Document not found' });
        }
    } catch (err) {
        console.log(`Error occured in deleting the event. Error e: ${err}`);
        return res.status(400).send({ message: 'Error occured' });
    }
}


module.exports = { createEvent, getAllEvents, getEvent, updateEvent, registerForEvent, deleteEvent };