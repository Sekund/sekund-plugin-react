import { People } from "@/domain/People";
import { peopleAvatar } from "@/helpers/avatars";
import { ArrowSmDownIcon, ArrowSmUpIcon, BadgeCheckIcon } from "@heroicons/react/solid";
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
                <button onClick={() => displaySharing(people._id)} className={`px-2 mr-0 ${people.unreadSharing ? 'border' : ''}`} key="shing" title={t('plugin:yourSharesDesc')}>
                    <div className="flex items-center">
                        <ArrowSmUpIcon className="w-4 h-4"></ArrowSmUpIcon> <div className={people.unreadSharing ? 'font-bold' : ''}>{people.sharing}</div>
                    </div>
                </button>
            );
        }
        if (people.shared > 0) {
            children.push(
                <button onClick={() => displayShared(people._id)} className={`px-2 mr-0 ${people.unreadShared ? 'border' : ''}`} key="shrd" title={t('plugin:theirShares')}>
                    <div className="flex items-center">
                        <ArrowSmDownIcon className="w-4 h-4"></ArrowSmDownIcon> <div className={people.unreadShared ? 'font-bold' : ''}>{people.shared}</div>
                    </div>
                </button>
            );
        }
        return children;
    }

    function badge() {

        if (people.unreadSharing || people.unreadShared) {
            return (<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-4">
                <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-accent-1" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx={4} cy={4} r={3} />
                </svg>
                {people.unreadSharing + people.unreadShared}
            </span>)
        }
        return null;

    }

    return (<div className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer bg-obs-primary hover:bg-obs-primary-alt" style={{ borderRight: "none", borderLeft: "none" }} >
        <div className="flex items-center flex-1 overflow-hidden">
            <div className="flex-shrink-0">{peopleAvatar(people, 10)}</div>
            <div className="flex items-center flex-1 min-w-0 ml-2 space-x-1 focus:outline-none">
                <p className="text-sm font-medium truncate text-primary">{people.name || people.email}</p>
                {badge()}
            </div>
        </div>
        <div className="flex items-center flex-shrink-0 space-x-2">{sharingStats()}</div>
    </div>

    )

}