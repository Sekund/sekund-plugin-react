import { People } from "@/domain/People";
import { peopleAvatar } from "@/helpers/avatars";
import { ArrowSmDownIcon, ArrowSmUpIcon } from "@heroicons/react/solid";
import ObjectID from "bson-objectid";
import React from 'react';
import { useTranslation } from "react-i18next";
type Props = {
    people: People
    displayShared: (id: ObjectID) => void
    displaySharing: (id: ObjectID) => void
}

export default function SekundPeopleSummary({ people, displayShared, displaySharing }: Props) {

    const { t } = useTranslation(["plugin"]);

    function sharingStats() {
        const children: Array<JSX.Element> = [];
        if (people.sharing > 0) {
            children.push(
                <button onClick={() => displaySharing(people._id)} className="px-2 mr-0" key="shing" title={t('plugin:yourSharesDesc')}>
                    <div className="flex items-center">
                        <ArrowSmUpIcon className="w-4 h-4"></ArrowSmUpIcon> {people?.sharing}
                    </div>
                </button>
            );
        }
        if (people.shared > 0) {
            children.push(
                <button onClick={() => displayShared(people._id)} className="px-2 mr-0" key="shrd" title={t('plugin:theirShares')}>
                    <div className="flex items-center">
                        <ArrowSmDownIcon className="w-4 h-4"></ArrowSmDownIcon> {people?.shared}
                    </div>
                </button>
            );
        }
        return children;
    }
    return (<div className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer bg-obs-primary hover:bg-obs-primary-alt" style={{ borderRight: "none", borderLeft: "none" }} >
        <div className="flex items-center flex-1 overflow-hidden">
            <div className="flex-shrink-0">{peopleAvatar(people, 10)}</div>
            <div className="flex-1 min-w-0 ml-2 focus:outline-none">
                <p className="text-sm font-medium truncate text-primary">{people.name || people.email}</p>
            </div>
        </div>
        <div className="flex items-center flex-shrink-0 space-x-2">{sharingStats()}</div>
    </div>

    )

}