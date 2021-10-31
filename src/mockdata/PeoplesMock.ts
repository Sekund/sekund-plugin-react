import ObjectID from "bson-objectid";
import { People } from "../domain/People";

const allPeoplesMock = [
	{ _id: { $oid: "6131eb9cfc13ae2018000483" }, name: "Aguie Grennan", image: "avatars/45.jpeg", email: "agrennan0@ucla.edu", createdAt: "2021-01-01T17:00:21Z", updatedAt: "2021-03-24T09:25:06Z", shared: 4, sharing: 2 },
	{ _id: { $oid: "6131eb9cfc13ae2018000484" }, name: "Gino Ettels", image: "avatars/52.jpeg", email: "gettels1@spiegel.de", createdAt: "2021-03-23T16:12:37Z", updatedAt: "2021-07-01T14:54:09Z", shared: 9, sharing: 5 },
	{ _id: { $oid: "6131eb9cfc13ae2018000485" }, name: "Gussi Ahmad", image: "avatars/60.jpeg", email: "gahmad2@spiegel.de", createdAt: "2021-05-04T08:41:42Z", updatedAt: "2021-02-22T19:58:43Z", shared: 1, sharing: 6 },
	{ _id: { $oid: "6131eb9cfc13ae2018000486" }, name: "Joby Wrate", image: "avatars/41.jpeg", email: "jwrate3@hhs.gov", createdAt: "2021-04-11T07:31:52Z", updatedAt: "2020-11-06T12:19:56Z", shared: 8, sharing: 9 },
	{ _id: { $oid: "6131eb9cfc13ae2018000487" }, name: "Tirrell Ambrogioni", image: "avatars/52.jpeg", email: "tambrogioni4@epa.gov", createdAt: "2021-04-15T13:08:56Z", updatedAt: "2021-08-15T10:29:05Z", shared: 7, sharing: 9 },
	{ _id: { $oid: "6131eb9cfc13ae2018000488" }, name: "Christiano Fantini", image: "avatars/18.jpeg", email: "cfantini5@comsenz.com", createdAt: "2020-11-10T00:57:22Z", updatedAt: "2021-06-12T02:07:45Z", shared: 5, sharing: 7 },
	{ _id: { $oid: "6131eb9cfc13ae2018000489" }, name: "Tito Meldon", image: "avatars/47.jpeg", email: "tmeldon6@cmu.edu", createdAt: "2021-08-09T21:32:35Z", updatedAt: "2021-08-25T00:11:37Z", shared: 9, sharing: 1 },
	{ _id: { $oid: "6131eb9cfc13ae201800048a" }, name: "Huey Ollivierre", image: "avatars/60.jpeg", email: "hollivierre7@bluehost.com", createdAt: "2020-12-19T23:41:35Z", updatedAt: "2021-06-19T17:03:41Z", shared: 3, sharing: 7 },
	{ _id: { $oid: "6131eb9cfc13ae201800048b" }, name: "Trixi Cicco", image: "avatars/26.jpeg", email: "tcicco8@newsvine.com", createdAt: "2021-08-13T09:09:37Z", updatedAt: "2020-09-19T10:00:51Z", shared: 2, sharing: 8 },
	{ _id: { $oid: "6131eb9cfc13ae201800048c" }, name: "Judas Base", image: "avatars/41.jpeg", email: "jbase9@theguardian.com", createdAt: "2021-01-02T05:44:43Z", updatedAt: "2021-05-11T08:15:10Z", shared: 4, sharing: 3 },
	{ _id: { $oid: "6131eb9cfc13ae201800048d" }, name: "Angil Odger", image: "avatars/44.jpeg", email: "aodgera@sciencedirect.com", createdAt: "2021-01-07T08:36:05Z", updatedAt: "2021-01-08T20:05:36Z", shared: 3, sharing: 1 },
	{ _id: { $oid: "6131eb9cfc13ae201800048e" }, name: "Rorie Fantonetti", image: "avatars/47.jpeg", email: "rfantonettib@zdnet.com", createdAt: "2021-04-27T00:00:58Z", updatedAt: "2020-10-06T11:11:38Z", shared: 8, sharing: 3 },
	{ _id: { $oid: "6131eb9cfc13ae201800048f" }, name: "Virginie Falla", image: "avatars/7.jpeg", email: "vfallac@mozilla.org", createdAt: "2020-10-30T03:48:25Z", updatedAt: "2021-07-26T15:41:51Z", shared: 7, sharing: 10 },
	{ _id: { $oid: "6131eb9cfc13ae2018000490" }, name: "Waiter Espinay", image: "avatars/19.jpeg", email: "wespinayd@disqus.com", createdAt: "2021-08-03T17:49:53Z", updatedAt: "2020-11-19T03:43:41Z", shared: 8, sharing: 7 },
	{ _id: { $oid: "6131eb9cfc13ae2018000491" }, name: "Innis McKennan", image: "avatars/26.jpeg", email: "imckennane@dailymotion.com", createdAt: "2021-05-12T03:49:27Z", updatedAt: "2021-02-01T22:44:11Z", shared: 2, sharing: 6 },
	{ _id: { $oid: "6131eb9cfc13ae2018000492" }, name: "Pammy Lago", image: "avatars/44.jpeg", email: "plagof@vinaora.com", createdAt: "2021-02-28T22:24:52Z", updatedAt: "2020-09-08T05:09:01Z", shared: 3, sharing: 7 },
	{ _id: { $oid: "6131eb9cfc13ae2018000493" }, name: "Stephenie Maber", image: "avatars/38.jpeg", email: "smaberg@go.com", createdAt: "2021-01-28T19:14:47Z", updatedAt: "2021-08-29T17:37:26Z", shared: 2, sharing: 2 },
	{ _id: { $oid: "6131eb9cfc13ae2018000494" }, name: "Ebeneser Idney", image: "avatars/67.jpeg", email: "eidneyh@msn.com", createdAt: "2020-11-16T19:49:24Z", updatedAt: "2021-06-20T10:27:58Z", shared: 9, sharing: 8 },
	{ _id: { $oid: "6131eb9cfc13ae2018000495" }, name: "Reece Lewer", image: "avatars/10.jpeg", email: "rleweri@tamu.edu", createdAt: "2020-10-13T20:59:53Z", updatedAt: "2021-04-14T17:32:51Z", shared: 2, sharing: 8 },
	{ _id: { $oid: "6131eb9cfc13ae2018000496" }, name: "Sayers Abrahamsohn", image: "avatars/36.jpeg", email: "sabrahamsohnj@mediafire.com", createdAt: "2021-03-30T03:49:02Z", updatedAt: "2021-07-18T23:33:28Z", shared: 8, sharing: 1 },
	{ _id: { $oid: "6131eb9cfc13ae2018000497" }, name: "Maryann Braybrook", image: "avatars/39.jpeg", email: "mbraybrookk@typepad.com", createdAt: "2021-04-15T01:23:46Z", updatedAt: "2021-06-27T22:24:43Z", shared: 9, sharing: 6 },
	{ _id: { $oid: "6131eb9cfc13ae2018000498" }, name: "Tawsha Cavet", image: "avatars/68.jpeg", email: "tcavetl@dailymotion.com", createdAt: "2020-09-05T22:42:05Z", updatedAt: "2020-10-15T11:18:00Z", shared: 2, sharing: 6 },
	{ _id: { $oid: "6131eb9cfc13ae2018000499" }, name: "Enrica Wixey", image: "avatars/1.jpeg", email: "ewixeym@bloomberg.com", createdAt: "2021-06-18T22:58:26Z", updatedAt: "2020-11-03T16:38:30Z", shared: 5, sharing: 9 },
	{ _id: { $oid: "6131eb9cfc13ae201800049a" }, name: "Dru Watkiss", image: "avatars/24.jpeg", email: "dwatkissn@xrea.com", createdAt: "2021-08-13T13:03:42Z", updatedAt: "2021-02-12T16:35:17Z", shared: 2, sharing: 5 },
	{ _id: { $oid: "6131eb9cfc13ae201800049b" }, name: "Barty Minchenton", image: "avatars/40.jpeg", email: "bminchentono@bloglovin.com", createdAt: "2021-02-06T06:02:01Z", updatedAt: "2020-09-11T09:46:00Z", shared: 2, sharing: 10 },
	{ _id: { $oid: "6131eb9cfc13ae201800049c" }, name: "Jillene Andryszczak", image: "avatars/68.jpeg", email: "jandryszczakp@cnet.com", createdAt: "2021-06-25T23:49:46Z", updatedAt: "2020-12-02T02:46:26Z", shared: 2, sharing: 7 },
	{ _id: { $oid: "6131eb9cfc13ae201800049d" }, name: "Rabbi Glasscoe", image: "avatars/18.jpeg", email: "rglasscoeq@opera.com", createdAt: "2021-03-22T02:08:52Z", updatedAt: "2020-09-14T12:07:39Z", shared: 5, sharing: 3 },
	{ _id: { $oid: "6131eb9cfc13ae201800049e" }, name: "Willette MacKeeg", image: "avatars/18.jpeg", email: "wmackeegr@xing.com", createdAt: "2020-11-18T22:46:53Z", updatedAt: "2020-09-15T02:04:59Z", shared: 5, sharing: 7 },
	{ _id: { $oid: "6131eb9cfc13ae201800049f" }, name: "Zea Basketter", image: "avatars/55.jpeg", email: "zbasketters@eventbrite.com", createdAt: "2020-11-09T17:57:16Z", updatedAt: "2021-01-14T01:12:48Z", shared: 9, sharing: 3 },
	{ _id: { $oid: "6131eb9cfc13ae20180004a0" }, name: "Ethelind Whisker", image: "avatars/27.jpeg", email: "ewhiskert@nydailynews.com", createdAt: "2021-01-01T03:08:41Z", updatedAt: "2021-02-23T00:07:12Z", shared: 4, sharing: 6 },
	{ _id: { $oid: "6131eb9cfc13ae20180004a1" }, name: "Danielle Belden", image: "avatars/52.jpeg", email: "dbeldenu@usgs.gov", createdAt: "2021-04-07T15:25:48Z", updatedAt: "2021-03-03T01:08:35Z", shared: 7, sharing: 6 },
	{ _id: { $oid: "6131eb9cfc13ae20180004a2" }, name: "Cherish Heggie", image: "avatars/44.jpeg", email: "cheggiev@blogspot.com", createdAt: "2020-11-18T10:52:34Z", updatedAt: "2021-01-14T04:35:20Z", shared: 7, sharing: 6 },
	{ _id: { $oid: "6131eb9cfc13ae20180004a3" }, name: "Ileana Geake", image: "avatars/60.jpeg", email: "igeakew@admin.ch", createdAt: "2021-03-31T23:52:02Z", updatedAt: "2021-03-27T08:23:52Z", shared: 9, sharing: 7 },
	{ _id: { $oid: "6131eb9cfc13ae20180004a4" }, name: "Marcile Bulman", image: "avatars/42.jpeg", email: "mbulmanx@deviantart.com", createdAt: "2020-11-25T06:19:47Z", updatedAt: "2021-02-11T06:33:35Z", shared: 3, sharing: 1 },
	{ _id: { $oid: "6131eb9cfc13ae20180004a5" }, name: "Alison L'Hommee", image: "avatars/67.jpeg", email: "alhommeey@engadget.com", createdAt: "2020-10-04T03:07:03Z", updatedAt: "2020-09-14T18:04:02Z", shared: 9, sharing: 3 },
	{ _id: { $oid: "6131eb9cfc13ae20180004a6" }, name: "Addy Bernolet", image: "avatars/48.jpeg", email: "abernoletz@state.gov", createdAt: "2021-07-27T05:12:22Z", updatedAt: "2021-04-14T00:06:47Z", shared: 1, sharing: 8 },
	{ _id: { $oid: "6131eb9cfc13ae20180004a7" }, name: "Margarette Quin", image: "avatars/40.jpeg", email: "mquin10@smugmug.com", createdAt: "2021-05-16T06:21:51Z", updatedAt: "2021-07-21T19:53:41Z", shared: 9, sharing: 10 },
	{ _id: { $oid: "6131eb9cfc13ae20180004a8" }, name: "Deedee Forrestill", image: "avatars/29.jpeg", email: "dforrestill11@posterous.com", createdAt: "2021-02-06T05:47:52Z", updatedAt: "2020-12-15T05:56:59Z", shared: 10, sharing: 2 },
	{ _id: { $oid: "6131eb9cfc13ae20180004a9" }, name: "Valentin Leal", image: "avatars/14.jpeg", email: "vleal12@flavors.me", createdAt: "2021-07-18T13:45:39Z", updatedAt: "2021-04-23T18:14:32Z", shared: 7, sharing: 7 },
	{ _id: { $oid: "6131eb9cfc13ae20180004aa" }, name: "Alfredo Conn", image: "avatars/16.jpeg", email: "aconn13@usatoday.com", createdAt: "2021-06-03T12:30:41Z", updatedAt: "2020-11-21T09:28:11Z", shared: 1, sharing: 8 },
	{ _id: { $oid: "6131eb9cfc13ae20180004ab" }, name: "Celene Chadderton", image: "avatars/4.jpeg", email: "cchadderton14@yolasite.com", createdAt: "2021-08-27T04:28:08Z", updatedAt: "2021-08-29T05:04:21Z", shared: 8, sharing: 5 },
	{ _id: { $oid: "6131eb9cfc13ae20180004ac" }, name: "Sandi Forsbey", image: "avatars/67.jpeg", email: "sforsbey15@time.com", createdAt: "2021-04-30T21:24:02Z", updatedAt: "2020-11-21T13:49:49Z", shared: 3, sharing: 5 },
	{ _id: { $oid: "6131eb9cfc13ae20180004ad" }, name: "Cletus Cope", image: "avatars/6.jpeg", email: "ccope16@123-reg.co.uk", createdAt: "2021-07-10T15:25:25Z", updatedAt: "2020-12-25T19:19:58Z", shared: 6, sharing: 6 },
];

export default allPeoplesMock.map((pd: any) => {
	return {
		_id: new ObjectID(pd._id.$oid),
		...pd,
	} as People;
});

export const someone = { _id: new ObjectID("6131eb9cfc13ae20180004ac"), name: "Celene Chadderton", image: "avatars/4.jpeg", email: "cchadderton14@yolasite.com", createdAt: new Date("2021-08-27T04:28:08Z"), updatedAt: new Date("2021-08-29T05:04:21Z"), shared: 8, sharing: 5 };