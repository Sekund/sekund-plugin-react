import SekundPluginReact from "@/main";
import ServerlessService from "@/services/ServerlessService";
import { EventsAction, EventsActionKind } from "@/state/EventsReducer";

export default class EventsWatcherService extends ServerlessService {
	private static _instance: EventsWatcherService;
	private watching = false;
	private resumeToken: any;

	constructor(plugin: SekundPluginReact) {
		super(plugin);
		EventsWatcherService._instance = this;
	}

	static get instance() {
		return EventsWatcherService._instance;
	}

	public async watchEvents(eventsDispatch: React.Dispatch<EventsAction>) {
		if (this.watching) {
			console.log("already watching");
			return;
		}
		const events = this.plugin.user.mongoClient("mongodb-atlas").db(this.plugin.settings.subdomain).collection("events");
		if (events) {
			try {
				const cursor = this.resumeToken ? events.watch({ resumeAfter: this.resumeToken }) : events.watch();
				this.watching = true;
				for await (const change of cursor) {
					this.resumeToken = change._id;
					switch (change.operationType) {
						case "insert": {
							const { fullDocument } = change;
							eventsDispatch({ type: EventsActionKind.SetEvent, payload: fullDocument });
							break;
						}
					}
				}
				this.watching = false;
			} catch (err) {
				this.watching = false;
			}
		}
	}
}
