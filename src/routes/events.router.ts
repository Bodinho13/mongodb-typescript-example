// External Dependencies
import express, {Request, Response} from "express";
import {ObjectId} from "mongodb";
import { collections } from "../services/database.service";
import Event from "../models/event";
// Global Config
export const eventRouter = express.Router();

eventRouter.use(express.json());
// GET
eventRouter.get("/", async (_req: Request, res: Response) => {
    try{
        const events = (await collections.events.find({}).toArray());
        res.status(200).send(events);
    } catch(error) {
        res.status(500).send(error.message);
    }
});

eventRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const query = { _id: new ObjectId(id) };
        const event = (await collections.events.findOne(query));

        if (event) {
            res.status(200).send(event);
        }
    } catch (error) {
        res.status(500).send(`Unable to find matching document with id: ${req.params.id}`);
    }
});
//POST
eventRouter.post("/", async (req: Request, res: Response) => {
    try {
        const newEvent = req.body as Event;
        const result = await collections.events.insertOne(newEvent);

        result ? res.status(201).send(`Successfully created a new event with id ${result.insertedId}`) 
            : res.status(500).send("Failed to create a new event.");
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});
//PUT
eventRouter.put("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const updatedEvent: Event = req.body as Event;
        const query = { _id: new ObjectId(id) };

        const result = await collections.events.updateOne(query, { $set: updatedEvent });

        result ? res.status(200).send(`Successfully updated game with id ${id}`)
             : res.status(304).send(`Game with id: ${id} not updated`);
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});
//DELETE
eventRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const query = { _id: new ObjectId(id) };
        const result = await collections.events.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed event with id ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove event with id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Game with id ${id} does not exist`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
})