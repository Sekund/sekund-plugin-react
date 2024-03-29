import { NoteComment } from "@/domain/NoteComment";
import ObjectID from "bson-objectid";
import { off } from "process";
import { Note } from "../domain/Note";

const allNotesMock = [
  {
    _id: { $oid: "61716443fc13ae4ad300000f" },
    created: 1600723373000,
    updated: 1600454490000,
    title: "3 Ninjas Kick Back",
    path: "vksptydhxdm.wpczfyihlgasn.xhvyjipgdua",
    content:
      "Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.\n\nProin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.",
    sharing: { peoples: [{ _id: "6171606afc13ae1f35000012" }], groups: [] },
    userId: { $oid: "6171606afc13ae1f35000000" },
    comments: [
      {
        text: "In congue. Etiam justo. Etiam pretium iaculis justo.",
        author: { _id: "6171606afc13ae1f35000002" },
        created: 1616117921000,
        updated: 1613514996000,
      },
    ],
  },
  {
    _id: { $oid: "61716443fc13ae4ad3000010" },
    created: 1623694004000,
    updated: 1615093880000,
    title: "Trials of Henry Kissinger, The",
    path: "gykdcabxnky.iassvuextbcrt.bmuwfoqbvut",
    content:
      "Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.\n\nCras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.",
    publicLink: { $oid: "61716443fc13ae4ad3000011" },
    sharing: { peoples: [{ _id: "6171606afc13ae1f3500000f" }], groups: [] },
    userId: { $oid: "6171606afc13ae1f35000004" },
    comments: [
      {
        text: "In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.",
        author: { _id: "6171606afc13ae1f3500000f" },
        created: 1608348226000,
        updated: 1625015921000,
      },
      {
        text: "Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.",
        author: { _id: "6171606afc13ae1f3500000e" },
        created: 1624854497000,
        updated: 1603797858000,
      },
      {
        text: "Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.",
        author: { _id: "6171606afc13ae1f35000007" },
        created: 1624875494000,
        updated: 1604850601000,
      },
      {
        text: "Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.",
        author: { _id: "6171606afc13ae1f35000008" },
        created: 1629512170000,
        updated: 1627269488000,
      },
      {
        text: "Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.",
        author: { _id: "6171606afc13ae1f35000011" },
        created: 1619048057000,
        updated: 1623743667000,
      },
      {
        text: "Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.",
        author: { _id: "6171606afc13ae1f35000007" },
        created: 1608924447000,
        updated: 1618650303000,
      },
      {
        text: "Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.",
        author: { _id: "6171606afc13ae1f35000012" },
        created: 1623319292000,
        updated: 1611228050000,
      },
      {
        text: "Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.",
        author: { _id: "6171606afc13ae1f35000004" },
        created: 1621706654000,
        updated: 1626252083000,
      },
      {
        text: "Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.",
        author: { _id: "6171606afc13ae1f35000001" },
        created: 1606374033000,
        updated: 1613004882000,
      },
      {
        text: "In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.",
        author: { _id: "6171606afc13ae1f35000005" },
        created: 1623542334000,
        updated: 1612673250000,
      },
    ],
  },
  {
    _id: { $oid: "61716443fc13ae4ad3000012" },
    created: 1610772195000,
    updated: 1613844760000,
    title: "Mystery (Fu cheng mi shi)",
    path: "ymvxbcfmuok.rprvekxmimlri.zaaqxnyiuom",
    content:
      "Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.",
    sharing: { peoples: [{ _id: "6171606afc13ae1f35000005" }, { _id: "6171606afc13ae1f35000002" }], groups: [] },
    userId: { $oid: "6171606afc13ae1f35000006" },
    comments: [
      {
        text: "Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.",
        author: { _id: "6171606afc13ae1f35000002" },
        created: 1601732277000,
        updated: 1606009712000,
      },
      {
        text: "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
        author: { _id: "6171606afc13ae1f35000013" },
        created: 1599015288000,
        updated: 1603288491000,
      },
      {
        text: "Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.",
        author: { _id: "6171606afc13ae1f35000011" },
        created: 1615038816000,
        updated: 1609402915000,
      },
    ],
  },
  {
    _id: { $oid: "61716443fc13ae4ad3000013" },
    created: 1615079148000,
    updated: 1626694923000,
    title: "Newton Boys, The",
    path: "gdbgfeigfmy.wdbzgglfpvtsx.poavypwloix",
    content:
      "Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.\n\nPraesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio.",
    sharing: { peoples: [{ _id: "6171606afc13ae1f3500000e" }, { _id: "6171606afc13ae1f35000010" }], groups: [] },
    userId: { $oid: "6171606afc13ae1f35000008" },
    comments: [
      {
        text: "Vestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.",
        author: { _id: "6171606afc13ae1f35000001" },
        created: 1624520411000,
        updated: 1620897922000,
      },
      {
        text: "Sed ante. Vivamus tortor. Duis mattis egestas metus.",
        author: { _id: "6171606afc13ae1f3500000f" },
        created: 1600233100000,
        updated: 1603371241000,
      },
      {
        text: "Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.",
        author: { _id: "6171606afc13ae1f35000005" },
        created: 1621699641000,
        updated: 1606886244000,
      },
      {
        text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.",
        author: { _id: "6171606afc13ae1f3500000e" },
        created: 1627052865000,
        updated: 1629747866000,
      },
      {
        text: "Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.",
        author: { _id: "6171606afc13ae1f35000001" },
        created: 1609927768000,
        updated: 1621717256000,
      },
      {
        text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.",
        author: { _id: "6171606afc13ae1f35000001" },
        created: 1612973960000,
        updated: 1601573668000,
      },
      {
        text: "Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.",
        author: { _id: "6171606afc13ae1f35000011" },
        created: 1621637644000,
        updated: 1618146863000,
      },
      {
        text: "Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.",
        author: { _id: "6171606afc13ae1f35000004" },
        created: 1608489406000,
        updated: 1617082222000,
      },
    ],
  },
  {
    _id: { $oid: "61716443fc13ae4ad3000014" },
    created: 1624896774000,
    updated: 1610838158000,
    title: "Oranges and Sunshine",
    path: "bhynappnkep.ygixssbkhwagf.geapsrhtuqo",
    content: "Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio.",
    sharing: {
      peoples: [
        { _id: "6171606afc13ae1f3500000a" },
        { _id: "6171606afc13ae1f3500000e" },
        { _id: "6171606afc13ae1f35000006" },
        { _id: "6171606afc13ae1f35000005" },
        { _id: "6171606afc13ae1f3500000f" },
      ],
      groups: [],
    },
    userId: { $oid: "6171606afc13ae1f35000013" },
    comments: [
      {
        text: "Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.",
        author: { _id: "6171606afc13ae1f3500000d" },
        created: 1618266600000,
        updated: 1617860174000,
      },
      {
        text: "In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.",
        author: { _id: "6171606afc13ae1f35000011" },
        created: 1604443312000,
        updated: 1612541654000,
      },
      {
        text: "Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.",
        author: { _id: "6171606afc13ae1f35000008" },
        created: 1612149485000,
        updated: 1615691332000,
      },
      {
        text: "Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum.",
        author: { _id: "6171606afc13ae1f3500000b" },
        created: 1622141728000,
        updated: 1608091795000,
      },
      {
        text: "Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.",
        author: { _id: "6171606afc13ae1f35000010" },
        created: 1602325168000,
        updated: 1598881955000,
      },
      {
        text: "Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.",
        author: { _id: "6171606afc13ae1f35000003" },
        created: 1616352866000,
        updated: 1628932778000,
      },
      {
        text: "Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.",
        author: { _id: "6171606afc13ae1f35000013" },
        created: 1623021517000,
        updated: 1606721903000,
      },
      {
        text: "Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.",
        author: { _id: "6171606afc13ae1f35000012" },
        created: 1612974303000,
        updated: 1625198547000,
      },
      {
        text: "Fusce consequat. Nulla nisl. Nunc nisl.",
        author: { _id: "6171606afc13ae1f35000000" },
        created: 1620470659000,
        updated: 1615272275000,
      },
    ],
  },
  {
    _id: { $oid: "61716443fc13ae4ad3000015" },
    created: 1627153045000,
    updated: 1611748526000,
    title: "Outrage",
    path: "qdiylpzqwhp.ylebuprgeulyd.nwterpkxjhu",
    content:
      "Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.\n\nSed ante. Vivamus tortor. Duis mattis egestas metus.",
    sharing: {
      peoples: [
        { _id: "6171606afc13ae1f35000001" },
        { _id: "6171606afc13ae1f35000008" },
        { _id: "6171606afc13ae1f3500000f" },
        { _id: "6171606afc13ae1f35000008" },
      ],
      groups: [],
    },
    userId: { $oid: "6171606afc13ae1f3500000e" },
    comments: [
      {
        text: "Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.",
        author: { _id: "6171606afc13ae1f35000005" },
        created: 1599578543000,
        updated: 1607189875000,
      },
      {
        text: "Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.",
        author: { _id: "6171606afc13ae1f35000013" },
        created: 1626678030000,
        updated: 1608460307000,
      },
      {
        text: "Sed ante. Vivamus tortor. Duis mattis egestas metus.",
        author: { _id: "6171606afc13ae1f35000008" },
        created: 1607405409000,
        updated: 1629327881000,
      },
      {
        text: "Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.",
        author: { _id: "6171606afc13ae1f3500000d" },
        created: 1602457041000,
        updated: 1611848199000,
      },
      {
        text: "Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.",
        author: { _id: "6171606afc13ae1f35000005" },
        created: 1608202104000,
        updated: 1606081965000,
      },
      {
        text: "Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.",
        author: { _id: "6171606afc13ae1f35000012" },
        created: 1622019347000,
        updated: 1612263643000,
      },
      {
        text: "Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.",
        author: { _id: "6171606afc13ae1f35000007" },
        created: 1608808456000,
        updated: 1608007377000,
      },
    ],
  },
  {
    _id: { $oid: "61716443fc13ae4ad3000016" },
    created: 1618459664000,
    updated: 1608250316000,
    title: "Water Horse: Legend of the Deep, The",
    path: "hkelspsztdl.xjhzfolnkxskj.vdrgdfmglvq",
    content:
      "Duis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus.\n\nMauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.\n\nNullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.",
    sharing: { peoples: [{ _id: "6171606afc13ae1f35000009" }], groups: [] },
    userId: { $oid: "6171606afc13ae1f35000010" },
    comments: [
      {
        text: "Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.",
        author: { _id: "6171606afc13ae1f3500000d" },
        created: 1628063248000,
        updated: 1613085350000,
      },
      {
        text: "Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.",
        author: { _id: "6171606afc13ae1f3500000a" },
        created: 1628685622000,
        updated: 1600685630000,
      },
      {
        text: "Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.",
        author: { _id: "6171606afc13ae1f35000003" },
        created: 1628348609000,
        updated: 1605803200000,
      },
      {
        text: "Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.",
        author: { _id: "6171606afc13ae1f35000011" },
        created: 1614832235000,
        updated: 1602443105000,
      },
      {
        text: "Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.",
        author: { _id: "6171606afc13ae1f35000003" },
        created: 1600492983000,
        updated: 1599716040000,
      },
      {
        text: "Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.",
        author: { _id: "6171606afc13ae1f35000004" },
        created: 1628957556000,
        updated: 1603564774000,
      },
      {
        text: "Vestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.",
        author: { _id: "6171606afc13ae1f35000000" },
        created: 1611531606000,
        updated: 1619680306000,
      },
      {
        text: "Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.",
        author: { _id: "6171606afc13ae1f35000003" },
        created: 1606287382000,
        updated: 1604959670000,
      },
      {
        text: "Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.",
        author: { _id: "6171606afc13ae1f35000012" },
        created: 1627983154000,
        updated: 1601149821000,
      },
    ],
  },
  {
    _id: { $oid: "61716443fc13ae4ad3000017" },
    created: 1608940747000,
    updated: 1628785402000,
    title: "Getaway, The",
    path: "jyihptpnblv.mojjfjecnwijy.fohxxzqlnvb",
    content:
      "Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.\n\nCum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.\n\nEtiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.",
    sharing: { peoples: [{ _id: "6171606afc13ae1f35000006" }], groups: [] },
    userId: { $oid: "6171606afc13ae1f35000000" },
    comments: [
      {
        text: "Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.",
        author: { _id: "6171606afc13ae1f35000010" },
        created: 1619226534000,
        updated: 1601407394000,
      },
      {
        text: "Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.",
        author: { _id: "6171606afc13ae1f35000010" },
        created: 1622370516000,
        updated: 1614443814000,
      },
      {
        text: "Phasellus in felis. Donec semper sapien a libero. Nam dui.",
        author: { _id: "6171606afc13ae1f3500000f" },
        created: 1599092301000,
        updated: 1613663721000,
      },
      {
        text: "Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.",
        author: { _id: "6171606afc13ae1f35000007" },
        created: 1627901965000,
        updated: 1613322514000,
      },
      {
        text: "Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.",
        author: { _id: "6171606afc13ae1f3500000e" },
        created: 1623318243000,
        updated: 1599595300000,
      },
      {
        text: "Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.",
        author: { _id: "6171606afc13ae1f35000001" },
        created: 1618879189000,
        updated: 1612721344000,
      },
      {
        text: "Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.",
        author: { _id: "6171606afc13ae1f35000003" },
        created: 1627923539000,
        updated: 1629317356000,
      },
    ],
  },
  {
    _id: { $oid: "61716443fc13ae4ad3000018" },
    created: 1616886479000,
    updated: 1614026871000,
    title: "Woman in White, The",
    path: "gutqzlbtdlr.rsuvjwbvgtcmj.smucasgbuwd",
    content:
      "Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.\n\nDuis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.",
    publicLink: { $oid: "61716443fc13ae4ad3000019" },
    sharing: {
      peoples: [
        { _id: "6171606afc13ae1f3500000c" },
        { _id: "6171606afc13ae1f35000005" },
        { _id: "6171606afc13ae1f35000007" },
        { _id: "6171606afc13ae1f35000006" },
      ],
      groups: [],
    },
    userId: { $oid: "6171606afc13ae1f35000005" },
    comments: [
      {
        text: "Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.",
        author: { _id: "6171606afc13ae1f35000006" },
        created: 1600352689000,
        updated: 1624309460000,
      },
      {
        text: "Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.",
        author: { _id: "6171606afc13ae1f3500000a" },
        created: 1616213267000,
        updated: 1629915277000,
      },
    ],
  },
  {
    _id: { $oid: "61716443fc13ae4ad300001a" },
    created: 1625598406000,
    updated: 1617332504000,
    title: "Burning Bed, The",
    path: "nxhjrrqtyqc.nckfqoagptogr.wpnyfnmbjdj",
    content: "Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.",
    sharing: { peoples: [{ _id: "6171606afc13ae1f35000006" }], groups: [] },
    userId: { $oid: "6171606afc13ae1f3500000a" },
    comments: [
      {
        text: "Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.",
        author: { _id: "6171606afc13ae1f35000000" },
        created: 1604095214000,
        updated: 1623316445000,
      },
      {
        text: "Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.",
        author: { _id: "6171606afc13ae1f3500000b" },
        created: 1606133913000,
        updated: 1620228881000,
      },
      {
        text: "Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.",
        author: { _id: "6171606afc13ae1f35000003" },
        created: 1623235331000,
        updated: 1606512641000,
      },
      {
        text: "Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.",
        author: { _id: "6171606afc13ae1f35000001" },
        created: 1619177379000,
        updated: 1604961637000,
      },
    ],
  },
  {
    _id: { $oid: "61716443fc13ae4ad300001b" },
    created: 1610772732000,
    updated: 1628990595000,
    title: "Liz & Dick ",
    path: "lfxxwylmwgh.jnoqvbypaeisv.zoszfwkdqqy",
    content:
      "Duis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus.\n\nMauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.",
    publicLink: { $oid: "61716443fc13ae4ad300001c" },
    sharing: {
      peoples: [
        { _id: "6171606afc13ae1f35000009" },
        { _id: "6171606afc13ae1f3500000b" },
        { _id: "6171606afc13ae1f35000005" },
        { _id: "6171606afc13ae1f3500000d" },
      ],
      groups: [],
    },
    userId: { $oid: "6171606afc13ae1f35000000" },
    comments: [
      {
        text: "Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.",
        author: { _id: "6171606afc13ae1f35000001" },
        created: 1600259739000,
        updated: 1604172666000,
      },
      {
        text: "Vestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.",
        author: { _id: "6171606afc13ae1f35000012" },
        created: 1603918544000,
        updated: 1620553497000,
      },
      {
        text: "Phasellus in felis. Donec semper sapien a libero. Nam dui.",
        author: { _id: "6171606afc13ae1f35000005" },
        created: 1604347838000,
        updated: 1608063530000,
      },
      {
        text: "In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.",
        author: { _id: "6171606afc13ae1f35000010" },
        created: 1616677771000,
        updated: 1612260967000,
      },
      {
        text: "Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.",
        author: { _id: "6171606afc13ae1f35000002" },
        created: 1615275544000,
        updated: 1599191064000,
      },
      {
        text: "Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.",
        author: { _id: "6171606afc13ae1f35000012" },
        created: 1612281120000,
        updated: 1611120853000,
      },
      {
        text: "Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio.",
        author: { _id: "6171606afc13ae1f35000005" },
        created: 1599651238000,
        updated: 1625405699000,
      },
    ],
  },
  {
    _id: { $oid: "61716443fc13ae4ad300001d" },
    created: 1628084632000,
    updated: 1612020404000,
    title: "The Gamers: Hands of Fate",
    path: "wprbcubusbu.yrxvcsutpvfsb.istqzycyvoi",
    content:
      "Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.\n\nVestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.",
    sharing: {
      peoples: [
        { _id: "6171606afc13ae1f35000013" },
        { _id: "6171606afc13ae1f3500000b" },
        { _id: "6171606afc13ae1f3500000b" },
        { _id: "6171606afc13ae1f35000000" },
      ],
      groups: [],
    },
    userId: { $oid: "6171606afc13ae1f3500000f" },
    comments: [
      {
        text: "Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.",
        author: { _id: "6171606afc13ae1f3500000e" },
        created: 1622916887000,
        updated: 1602830685000,
      },
      {
        text: "Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.",
        author: { _id: "6171606afc13ae1f3500000b" },
        created: 1619424033000,
        updated: 1611450046000,
      },
      {
        text: "Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.",
        author: { _id: "6171606afc13ae1f35000005" },
        created: 1620484456000,
        updated: 1616116519000,
      },
      {
        text: "Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.",
        author: { _id: "6171606afc13ae1f3500000a" },
        created: 1600651395000,
        updated: 1628443990000,
      },
      {
        text: "Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.",
        author: { _id: "6171606afc13ae1f35000005" },
        created: 1601277522000,
        updated: 1620038727000,
      },
      {
        text: "Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.",
        author: { _id: "6171606afc13ae1f35000001" },
        created: 1614920718000,
        updated: 1619414350000,
      },
      {
        text: "Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.",
        author: { _id: "6171606afc13ae1f35000006" },
        created: 1603419176000,
        updated: 1626978340000,
      },
    ],
  },
  {
    _id: { $oid: "61716443fc13ae4ad300001e" },
    created: 1611417612000,
    updated: 1629263022000,
    title: "Way Home, The (Jibeuro)",
    path: "bjadbsgafmr.uthtuygjxfaxr.pcjojeqwywz",
    content:
      "Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.\n\nPraesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.",
    sharing: { peoples: [{ _id: "6171606afc13ae1f35000008" }], groups: [] },
    userId: { $oid: "6171606afc13ae1f35000010" },
    comments: [
      {
        text: "Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.",
        author: { _id: "6171606afc13ae1f35000004" },
        created: 1627300393000,
        updated: 1626732594000,
      },
      {
        text: "Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.",
        author: { _id: "6171606afc13ae1f3500000c" },
        created: 1624192064000,
        updated: 1624033656000,
      },
      {
        text: "Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.",
        author: { _id: "6171606afc13ae1f35000012" },
        created: 1620951843000,
        updated: 1598994230000,
      },
      {
        text: "Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.",
        author: { _id: "6171606afc13ae1f35000006" },
        created: 1607029470000,
        updated: 1614100103000,
      },
      {
        text: "Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.",
        author: { _id: "6171606afc13ae1f35000007" },
        created: 1599049500000,
        updated: 1616185047000,
      },
      {
        text: "Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.",
        author: { _id: "6171606afc13ae1f35000002" },
        created: 1603198750000,
        updated: 1604261699000,
      },
    ],
  },
  {
    _id: { $oid: "61716443fc13ae4ad300001f" },
    created: 1614118606000,
    updated: 1612292642000,
    title: "The Auction",
    path: "bjjlenictes.mqynjdankjytz.qrlfcxkyhcf",
    content:
      "Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.",
    sharing: { peoples: [{ _id: "6171606afc13ae1f3500000a" }, { _id: "6171606afc13ae1f35000013" }, { _id: "6171606afc13ae1f35000008" }], groups: [] },
    userId: { $oid: "6171606afc13ae1f35000004" },
    comments: [
      {
        text: "Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.",
        author: { _id: "6171606afc13ae1f35000008" },
        created: 1621139858000,
        updated: 1608774351000,
      },
    ],
  },
  {
    _id: { $oid: "61716443fc13ae4ad3000020" },
    created: 1625879349000,
    updated: 1601048174000,
    title: "Crimson Pirate, The",
    path: "kidduphslqm.irjxpgkhpxuqz.gcdwwoomqqt",
    content: "Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.",
    sharing: { peoples: [{ _id: "6171606afc13ae1f35000000" }], groups: [] },
    userId: { $oid: "6171606afc13ae1f3500000d" },
    comments: [
      {
        text: "In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.",
        author: { _id: "6171606afc13ae1f35000010" },
        created: 1607336379000,
        updated: 1624198155000,
      },
      {
        text: "Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.",
        author: { _id: "6171606afc13ae1f3500000f" },
        created: 1603481880000,
        updated: 1616034054000,
      },
    ],
  },
  {
    _id: { $oid: "61716443fc13ae4ad3000021" },
    created: 1617032132000,
    updated: 1613267486000,
    title: "Dangerous Liaisons",
    path: "njlepypowuw.raapwfflagmef.kmdnheyymls",
    content:
      "Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.\n\nDonec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.\n\nDuis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.",
    sharing: { peoples: [{ _id: "6171606afc13ae1f3500000c" }, { _id: "6171606afc13ae1f3500000c" }], groups: [] },
    userId: { $oid: "6171606afc13ae1f35000001" },
    comments: [
      {
        text: "Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.",
        author: { _id: "6171606afc13ae1f35000006" },
        created: 1627372590000,
        updated: 1624016110000,
      },
      {
        text: "Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.",
        author: { _id: "6171606afc13ae1f3500000e" },
        created: 1624223663000,
        updated: 1621653188000,
      },
    ],
  },
  {
    _id: { $oid: "61716443fc13ae4ad3000022" },
    created: 1604108675000,
    updated: 1615462037000,
    title: "Pekka ja Pätkä neekereinä",
    path: "toxfduqjreu.kxcltqyqvszvp.eiyivcaagos",
    content: "Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.",
    sharing: { peoples: [{ _id: "6171606afc13ae1f35000001" }, { _id: "6171606afc13ae1f3500000a" }], groups: [] },
    userId: { $oid: "6171606afc13ae1f3500000f" },
    comments: [
      {
        text: "Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.",
        author: { _id: "6171606afc13ae1f35000008" },
        created: 1609808521000,
        updated: 1628111533000,
      },
      {
        text: "Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",
        author: { _id: "6171606afc13ae1f35000004" },
        created: 1609447214000,
        updated: 1609617012000,
      },
      {
        text: "Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.",
        author: { _id: "6171606afc13ae1f3500000b" },
        created: 1621422624000,
        updated: 1599956363000,
      },
      {
        text: "Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum.",
        author: { _id: "6171606afc13ae1f35000008" },
        created: 1625866850000,
        updated: 1606135753000,
      },
      {
        text: "Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.",
        author: { _id: "6171606afc13ae1f3500000c" },
        created: 1620195718000,
        updated: 1628429719000,
      },
      {
        text: "Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.",
        author: { _id: "6171606afc13ae1f35000005" },
        created: 1607018550000,
        updated: 1622585169000,
      },
      {
        text: "Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.",
        author: { _id: "6171606afc13ae1f3500000a" },
        created: 1626555536000,
        updated: 1626613604000,
      },
    ],
  },
  {
    _id: { $oid: "61716443fc13ae4ad3000023" },
    created: 1605161750000,
    updated: 1623508559000,
    title: "Court Jester, The",
    path: "rspkxpbbzvs.fiiouxqsselzz.tkgftmbpzku",
    content:
      "Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.\n\nMorbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.\n\nFusce consequat. Nulla nisl. Nunc nisl.",
    sharing: { peoples: [{ _id: "6171606afc13ae1f35000007" }, { _id: "6171606afc13ae1f3500000a" }], groups: [] },
    userId: { $oid: "6171606afc13ae1f35000009" },
    comments: [
      {
        text: "Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.",
        author: { _id: "6171606afc13ae1f3500000b" },
        created: 1616282184000,
        updated: 1605973396000,
      },
      {
        text: "Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.",
        author: { _id: "6171606afc13ae1f35000011" },
        created: 1609191477000,
        updated: 1612220366000,
      },
      {
        text: "Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.",
        author: { _id: "6171606afc13ae1f35000011" },
        created: 1612152289000,
        updated: 1628217380000,
      },
      {
        text: "Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.",
        author: { _id: "6171606afc13ae1f3500000b" },
        created: 1612907687000,
        updated: 1603799375000,
      },
      {
        text: "In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.",
        author: { _id: "6171606afc13ae1f35000005" },
        created: 1629122116000,
        updated: 1613288128000,
      },
      {
        text: "Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.",
        author: { _id: "6171606afc13ae1f35000010" },
        created: 1612699321000,
        updated: 1609401853000,
      },
    ],
  },
  {
    _id: { $oid: "61716443fc13ae4ad3000024" },
    created: 1616113930000,
    updated: 1608924665000,
    title: "Vertical Ray of the Sun, The (Mua he chieu thang dung)",
    path: "qglczcggmbv.vbsgvujyuaatr.xtcvlqsdxrl",
    content:
      "Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.",
    sharing: {
      peoples: [
        { _id: "6171606afc13ae1f3500000f" },
        { _id: "6171606afc13ae1f35000007" },
        { _id: "6171606afc13ae1f35000004" },
        { _id: "6171606afc13ae1f35000007" },
      ],
      groups: [],
    },
    userId: { $oid: "6171606afc13ae1f3500000e" },
    comments: [
      {
        text: "Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.",
        author: { _id: "6171606afc13ae1f35000011" },
        created: 1604955229000,
        updated: 1606364214000,
      },
      {
        text: "In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.",
        author: { _id: "6171606afc13ae1f35000011" },
        created: 1607911150000,
        updated: 1601975437000,
      },
      {
        text: "Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.",
        author: { _id: "6171606afc13ae1f3500000e" },
        created: 1626137046000,
        updated: 1607269474000,
      },
      {
        text: "Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.",
        author: { _id: "6171606afc13ae1f35000010" },
        created: 1607874678000,
        updated: 1629335158000,
      },
      {
        text: "Fusce consequat. Nulla nisl. Nunc nisl.",
        author: { _id: "6171606afc13ae1f3500000d" },
        created: 1604454728000,
        updated: 1602822364000,
      },
      {
        text: "Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.",
        author: { _id: "6171606afc13ae1f35000007" },
        created: 1622203191000,
        updated: 1606682064000,
      },
    ],
  },
  {
    _id: { $oid: "61716443fc13ae4ad3000025" },
    created: 1615613439000,
    updated: 1618198058000,
    title: "Father and Guns (De père en flic)",
    path: "nwwnvsvmxty.fjybabbkfkdiz.xkotwixfbnx",
    content:
      "Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum.\n\nIn hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.\n\nAliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.",
    sharing: { peoples: [{ _id: "6171606afc13ae1f35000002" }], groups: [] },
    userId: { $oid: "6171606afc13ae1f35000000" },
    comments: [
      {
        text: "Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.",
        author: { _id: "6171606afc13ae1f35000005" },
        created: 1608509862000,
        updated: 1614841912000,
      },
      {
        text: "Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.",
        author: { _id: "6171606afc13ae1f35000006" },
        created: 1615698683000,
        updated: 1626504348000,
      },
      {
        text: "Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.",
        author: { _id: "6171606afc13ae1f35000002" },
        created: 1601884460000,
        updated: 1605855532000,
      },
      {
        text: "In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.",
        author: { _id: "6171606afc13ae1f35000001" },
        created: 1612579165000,
        updated: 1614353628000,
      },
      {
        text: "Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.",
        author: { _id: "6171606afc13ae1f35000007" },
        created: 1605387176000,
        updated: 1615438906000,
      },
      {
        text: "Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.",
        author: { _id: "6171606afc13ae1f35000012" },
        created: 1627887367000,
        updated: 1619182239000,
      },
      {
        text: "Duis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus.",
        author: { _id: "6171606afc13ae1f3500000b" },
        created: 1608932429000,
        updated: 1627493071000,
      },
      {
        text: "Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",
        author: { _id: "6171606afc13ae1f35000001" },
        created: 1611296550000,
        updated: 1616840688000,
      },
      {
        text: "Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.",
        author: { _id: "6171606afc13ae1f35000010" },
        created: 1624525604000,
        updated: 1622750908000,
      },
    ],
  },
  {
    _id: { $oid: "61716443fc13ae4ad3000026" },
    created: 1620011851000,
    updated: 1628829463000,
    title: "Farewell My Concubine (Ba wang bie ji)",
    path: "tvfwheydbqx.glyovmswzvruk.nmymrdzodvc",
    content:
      "Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio.\n\nCras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.\n\nProin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.",
    sharing: {
      peoples: [
        { _id: "6171606afc13ae1f35000010" },
        { _id: "6171606afc13ae1f35000013" },
        { _id: "6171606afc13ae1f3500000e" },
        { _id: "6171606afc13ae1f35000005" },
        { _id: "6171606afc13ae1f35000008" },
      ],
      groups: [],
    },
    userId: { $oid: "6171606afc13ae1f35000012" },
    comments: [
      {
        text: "Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.",
        author: { _id: "6171606afc13ae1f35000006" },
        created: 1608389799000,
        updated: 1609647510000,
      },
      {
        text: "Fusce consequat. Nulla nisl. Nunc nisl.",
        author: { _id: "6171606afc13ae1f35000004" },
        created: 1599607957000,
        updated: 1618971495000,
      },
    ],
  },
  {
    _id: { $oid: "61716443fc13ae4ad3000027" },
    created: 1623803479000,
    updated: 1610177424000,
    title: "100 Ways to Murder Your Wife (Sha qi er ren zu)",
    path: "hxzxsowflhi.rkxqgvshswnwk.dfstfzvzglv",
    content:
      "Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.\n\nIn quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.\n\nMaecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.",
    sharing: {
      peoples: [
        { _id: "6171606afc13ae1f3500000d" },
        { _id: "6171606afc13ae1f35000004" },
        { _id: "6171606afc13ae1f35000010" },
        { _id: "6171606afc13ae1f35000004" },
        { _id: "6171606afc13ae1f35000000" },
      ],
      groups: [],
    },
    userId: { $oid: "6171606afc13ae1f35000000" },
    comments: [
      {
        text: "In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.",
        author: { _id: "6171606afc13ae1f35000010" },
        created: 1605087291000,
        updated: 1626583509000,
      },
      {
        text: "Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.",
        author: { _id: "6171606afc13ae1f35000011" },
        created: 1610604950000,
        updated: 1604960106000,
      },
    ],
  },
  {
    _id: { $oid: "61716443fc13ae4ad3000028" },
    created: 1612798172000,
    updated: 1600886973000,
    title: "Ramen Girl, The",
    path: "rrwndthvxik.ehkvklvgofgdi.qxeoimoafnd",
    content:
      "Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.\n\nPhasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.\n\nProin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.",
    sharing: {
      peoples: [
        { _id: "6171606afc13ae1f3500000c" },
        { _id: "6171606afc13ae1f35000013" },
        { _id: "6171606afc13ae1f35000007" },
        { _id: "6171606afc13ae1f35000012" },
        { _id: "6171606afc13ae1f3500000b" },
      ],
      groups: [],
    },
    userId: { $oid: "6171606afc13ae1f35000005" },
    comments: [
      {
        text: "Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.",
        author: { _id: "6171606afc13ae1f35000003" },
        created: 1619863026000,
        updated: 1607870547000,
      },
      {
        text: "Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum.",
        author: { _id: "6171606afc13ae1f3500000f" },
        created: 1616734456000,
        updated: 1605997795000,
      },
      {
        text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.",
        author: { _id: "6171606afc13ae1f3500000c" },
        created: 1608695761000,
        updated: 1613658912000,
      },
      {
        text: "Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.",
        author: { _id: "6171606afc13ae1f35000012" },
        created: 1621830070000,
        updated: 1616164609000,
      },
    ],
  },
  {
    _id: { $oid: "61716443fc13ae4ad3000029" },
    created: 1614866004000,
    updated: 1606352143000,
    title: "K2",
    path: "wkxqcxwwbly.mdotayebfjlwr.gvlgzhygwln",
    content:
      "Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio.\n\nCras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
    sharing: { peoples: [{ _id: "6171606afc13ae1f35000013" }, { _id: "6171606afc13ae1f35000009" }], groups: [] },
    userId: { $oid: "6171606afc13ae1f35000004" },
    comments: [
      {
        text: "Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.",
        author: { _id: "6171606afc13ae1f35000007" },
        created: 1619917886000,
        updated: 1604256759000,
      },
      {
        text: "Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.",
        author: { _id: "6171606afc13ae1f35000009" },
        created: 1615777592000,
        updated: 1607540199000,
      },
      {
        text: "Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.",
        author: { _id: "6171606afc13ae1f3500000a" },
        created: 1628134717000,
        updated: 1610872478000,
      },
      {
        text: "In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.",
        author: { _id: "6171606afc13ae1f35000010" },
        created: 1626694371000,
        updated: 1601903669000,
      },
      {
        text: "Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.",
        author: { _id: "6171606afc13ae1f35000005" },
        created: 1607274398000,
        updated: 1600402045000,
      },
      {
        text: "Phasellus in felis. Donec semper sapien a libero. Nam dui.",
        author: { _id: "6171606afc13ae1f3500000d" },
        created: 1621805012000,
        updated: 1613206469000,
      },
    ],
  },
  {
    _id: { $oid: "61716443fc13ae4ad300002a" },
    created: 1624302705000,
    updated: 1617308009000,
    title: "Nas: Time Is Illmatic",
    path: "qoxjboayytb.iafavtqsivcid.mombaqqnpnp",
    content: "Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.",
    sharing: { peoples: [{ _id: "6171606afc13ae1f35000006" }, { _id: "6171606afc13ae1f35000004" }, { _id: "6171606afc13ae1f35000012" }], groups: [] },
    userId: { $oid: "6171606afc13ae1f3500000f" },
    comments: [
      {
        text: "Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.",
        author: { _id: "6171606afc13ae1f35000003" },
        created: 1629336935000,
        updated: 1612181550000,
      },
    ],
  },
];

const users = [
  {
    _id: { $oid: "6171606afc13ae1f3500000c" },
    name: "Lemuel Sorton",
    image: "avatars/1.jpeg",
    email: "lsorton0@cbsnews.com",
    createdAt: 1601370089000,
    updatedAt: 1612856781000,
  },
  {
    _id: { $oid: "6171606afc13ae1f35000004" },
    name: "Rochelle Ovill",
    image: "avatars/2.jpeg",
    email: "rovill1@opensource.org",
    createdAt: 1613852833000,
    updatedAt: 1621750710000,
  },
  {
    _id: { $oid: "6171606afc13ae1f35000010" },
    name: "Berri Sicily",
    image: "avatars/3.jpeg",
    email: "bsicily2@virginia.edu",
    createdAt: 1625464432000,
    updatedAt: 1600426230000,
  },
  {
    _id: { $oid: "6171606afc13ae1f35000003" },
    name: "Kevina Kluss",
    image: "avatars/4.jpeg",
    email: "kkluss3@deliciousdays.com",
    createdAt: 1624554486000,
    updatedAt: 1612725162000,
  },
  {
    _id: { $oid: "6171606afc13ae1f3500000e" },
    name: "Prudy Skelly",
    image: "avatars/5.jpeg",
    email: "pskelly4@pen.io",
    createdAt: 1614745012000,
    updatedAt: 1610713127000,
  },
  {
    _id: { $oid: "6171606afc13ae1f3500000d" },
    name: "Bradan Simison",
    image: "avatars/6.jpeg",
    email: "bsimison5@mysql.com",
    createdAt: 1610700264000,
    updatedAt: 1605564626000,
  },
  {
    _id: { $oid: "6171606afc13ae1f35000009" },
    name: "Kate Thoma",
    image: "avatars/7.jpeg",
    email: "kthoma6@cisco.com",
    createdAt: 1601367466000,
    updatedAt: 1612006368000,
  },
  {
    _id: { $oid: "6171606afc13ae1f35000002" },
    name: "Lovell Beddard",
    image: "avatars/8.jpeg",
    email: "lbeddard7@washingtonpost.com",
    createdAt: 1608453424000,
    updatedAt: 1623909989000,
  },
  {
    _id: { $oid: "6171606afc13ae1f35000008" },
    name: "Marleen Heino",
    image: "avatars/9.jpeg",
    email: "mheino8@dot.gov",
    createdAt: 1612278350000,
    updatedAt: 1605733597000,
  },
  {
    _id: { $oid: "6171606afc13ae1f35000012" },
    name: "Obidiah Rowcastle",
    image: "avatars/10.jpeg",
    email: "orowcastle9@wikia.com",
    createdAt: 1604786583000,
    updatedAt: 1614048781000,
  },
  {
    _id: { $oid: "6171606afc13ae1f3500000f" },
    name: "Eleen Ovid",
    image: "avatars/11.jpeg",
    email: "eovida@netlog.com",
    createdAt: 1607059961000,
    updatedAt: 1616507059000,
  },
  {
    _id: { $oid: "6171606afc13ae1f35000007" },
    name: "Fidole Ahmed",
    image: "avatars/12.jpeg",
    email: "fahmedb@51.la",
    createdAt: 1618675731000,
    updatedAt: 1601016872000,
  },
  {
    _id: { $oid: "6171606afc13ae1f3500000f" },
    name: "Kathryn Saleway",
    image: "avatars/13.jpeg",
    email: "ksalewayc@ezinearticles.com",
    createdAt: 1604736249000,
    updatedAt: 1621354645000,
  },
  {
    _id: { $oid: "6171606afc13ae1f3500000f" },
    name: "Skye Agott",
    image: "avatars/14.jpeg",
    email: "sagottd@dedecms.com",
    createdAt: 1602427921000,
    updatedAt: 1603510362000,
  },
  {
    _id: { $oid: "6171606afc13ae1f35000009" },
    name: "Maddi Tapsell",
    image: "avatars/15.jpeg",
    email: "mtapselle@unblog.fr",
    createdAt: 1608375932000,
    updatedAt: 1622771854000,
  },
  {
    _id: { $oid: "6171606afc13ae1f3500000e" },
    name: "Nathan Mar",
    image: "avatars/16.jpeg",
    email: "nmarf@who.int",
    createdAt: 1625686292000,
    updatedAt: 1608083615000,
  },
  {
    _id: { $oid: "6171606afc13ae1f35000012" },
    name: "Ian Derham",
    image: "avatars/17.jpeg",
    email: "iderhamg@shop-pro.jp",
    createdAt: 1605913862000,
    updatedAt: 1623405375000,
  },
  {
    _id: { $oid: "6171606afc13ae1f3500000b" },
    name: "Gerda Bransden",
    image: "avatars/18.jpeg",
    email: "gbransdenh@drupal.org",
    createdAt: 1599594666000,
    updatedAt: 1623161001000,
  },
  {
    _id: { $oid: "6171606afc13ae1f35000010" },
    name: "Panchito Stansby",
    image: "avatars/19.jpeg",
    email: "pstansbyi@cam.ac.uk",
    createdAt: 1614769701000,
    updatedAt: 1604481218000,
  },
  {
    _id: { $oid: "6171606afc13ae1f35000006" },
    name: "Cassy Jovis",
    image: "avatars/20.jpeg",
    email: "cjovisj@wiley.com",
    createdAt: 1611478865000,
    updatedAt: 1620836559000,
  },
];

const convertNote = (nd: any) => {
  const comments = nd.comments
    .map((c) => {
      const author = users.filter((u) => {
        const found = u._id.$oid === c.author._id;
        return found;
      })[0];
      if (author) {
        return { ...c, author: { ...author, _id: new ObjectID(author._id.$oid) } };
      }
    })
    .filter((c) => c !== undefined);

  if (nd.sharing.peoples) {
    nd.sharing.peoples = nd.sharing.peoples
      .map((p) => {
        const person = users.filter((u) => {
          const found = u._id.$oid === p._id.toString();
          return found;
        })[0];
        return person;
      })
      .filter((p) => p !== undefined);
  }

  return {
    ...nd,
    _id: new ObjectID(nd._id.$oid),
    image: `http://next.sekund.io${nd.image}`,
    comments,
  } as Note;
};

export default allNotesMock.map(convertNote);

export const someNote = convertNote({
  _id: { $oid: "61716443fc13ae4ad3000025" },
  created: 1615613439000,
  updated: 1618198058000,
  title: "Father and Guns (De père en flic)",
  path: "nwwnvsvmxty.fjybabbkfkdiz.xkotwixfbnx",
  content:
    "Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum.\n\nIn hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.\n\nAliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.",
  sharing: { peoples: [{ _id: "6171606afc13ae1f35000002" }], groups: [] },
  userId: { $oid: "6171606afc13ae1f35000000" },
  comments: [
    {
      text: "Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.",
      author: { _id: "6171606afc13ae1f35000005" },
      created: 1608509862000,
      updated: 1614841912000,
    },
    {
      text: "Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.",
      author: { _id: "6171606afc13ae1f35000006" },
      created: 1615698683000,
      updated: 1626504348000,
    },
    {
      text: "Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.",
      author: { _id: "6171606afc13ae1f35000002" },
      created: 1601884460000,
      updated: 1605855532000,
    },
    {
      text: "In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.",
      author: { _id: "6171606afc13ae1f35000001" },
      created: 1612579165000,
      updated: 1614353628000,
    },
    {
      text: "Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.",
      author: { _id: "6171606afc13ae1f35000007" },
      created: 1605387176000,
      updated: 1615438906000,
    },
    {
      text: "Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.",
      author: { _id: "6171606afc13ae1f35000012" },
      created: 1627887367000,
      updated: 1619182239000,
    },
    {
      text: "Duis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus.",
      author: { _id: "6171606afc13ae1f3500000b" },
      created: 1608932429000,
      updated: 1627493071000,
    },
    {
      text: "Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",
      author: { _id: "6171606afc13ae1f35000001" },
      created: 1611296550000,
      updated: 1616840688000,
    },
    {
      text: "Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.",
      author: { _id: "6171606afc13ae1f35000010" },
      created: 1624525604000,
      updated: 1622750908000,
    },
  ],
});

export const someUnsharedNote = convertNote({
  _id: { $oid: "61716443fc13ae4ad3000025" },
  created: 1615613439000,
  updated: 1618198058000,
  title: "Father and Guns (De père en flic)",
  path: "nwwnvsvmxty.fjybabbkfkdiz.xkotwixfbnx",
  content:
    "Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum.\n\nIn hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.\n\nAliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.",
  sharing: {},
  userId: { $oid: "6171606afc13ae1f35000000" },
  comments: [],
});
