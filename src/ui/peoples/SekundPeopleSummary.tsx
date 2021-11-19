import { People } from "@/domain/People";
import { peopleAvatar } from "@/helpers/avatars";
import { ArrowSmDownIcon, ArrowSmUpIcon, BadgeCheckIcon, DownloadIcon, UploadIcon } from "@heroicons/react/solid";
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
                    <div className={`flex items-center space-x-1 ${people.unreadSharing ? 'font-bold text-accent-4' : ''}`}>
                        <UploadIcon className="w-4 h-4"></UploadIcon> <div>{people.sharing}</div>
                    </div>
                </button>
            );
        }
        if (people.shared > 0) {
            children.push(
                <button onClick={() => displayShared(people._id)} className={`px-2 mr-0 ${people.unreadShared ? 'border' : ''}`} key="shrd" title={t('plugin:theirShares')}>
                    <div className={`flex items-center space-x-1 ${people.unreadShared ? 'font-bold text-accent-4' : ''}`}>
                        <DownloadIcon className="w-4 h-4" /> <div>{people.shared}</div>
                    </div>
                </button>
            );
        }
        return children;
    }

    const unreadCount = people.unreadSharing || 0 + people.unreadShared || 0;

    return (<div className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer bg-obs-primary hover:bg-obs-primary-alt" style={{ borderRight: "none", borderLeft: "none" }} >
        <div className="flex items-center flex-1 overflow-hidden">
            <div className="flex-shrink-0">{peopleAvatar(people, 10, unreadCount && unreadCount > 0 ? unreadCount : undefined)}</div>
            <div className="flex items-center flex-1 min-w-0 ml-2 space-x-1 focus:outline-none">
                <p className="text-sm font-medium truncate text-primary">{people.name || people.email}</p>
            </div>
        </div>
        <div className="flex items-center flex-shrink-0 space-x-2">{sharingStats()}</div>
    </div>

    )

}