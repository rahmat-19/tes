import { Cron } from "@nestjs/schedule";
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { MessageBody, SubscribeMessage } from "@nestjs/websockets/decorators";
import { Server, Socket } from 'socket.io';
import { ActivityService } from "./activity.service";
import { CreateActivityDto } from "./dto/create-activity.dto";

@WebSocketGateway({
    cors: {
        origin: '*'
    },
})

export class ActivityGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server

    constructor(
        private readonly activityService: ActivityService,
    ){}


    async handleConnection(socket: Socket) {
        /* Get allActivity */

        /* Plant A */
        // this.server.emit('getActivity', await this.activityService.findAll())

        /* Plante B */
        this.server.emit('getActivity', {activity: await this.activityService.findAll(), lastActivity: await this.activityService.getLastActivity()})
    }

    async handleDisconnect(socket: Socket) {
        console.log('Dosconnected');
        socket.disconnect()
    }

    @SubscribeMessage('sendActivity')
    async handleSendActivity(
        @MessageBody() createActivityDto: CreateActivityDto,
        ) {
            /* Plant A */
            // const activity = await this.activityService.create(createActivityDto)
            // this.server.emit('newActivity',  await this.activityService.findAll())

            /* Plante B */
            const activity = await this.activityService.pushActivity(createActivityDto)
            this.server.emit('newActivity', activity)

    }

    /* Plant A */
    @Cron('0 */1 * * * *') // Run every 1 minutes
    async saveActivityToDatabase() {
        const condition = await this.activityService.saveLastActivity()
        if (condition == "2000") {
            this.server.emit('activity',  {activity: await this.activityService.findAll(), lastActivity: await this.activityService.getLastActivity()})
        }
    }
}