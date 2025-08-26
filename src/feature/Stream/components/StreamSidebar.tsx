import React from "react";
import AuthorListItemNoCheckbox from "./AuthorListItemNoCheckBox";

const mockStreams = [
  {
    id: "1",
    name: "Science dos Cameroes",
    description: "Data science compass for young Cameroonia...",
    tags: ["data", "machinelearning", "science"],
  },
  {
    id: "2",
    name: "Data Science Collectives",
    description: "Data journal for CSE majors",
    tags: ["data", "machinelearning", "science"],
  },
  {
    id: "3",
    name: "Data Army",
    description: "Data science compass for young Cameroonians",
    tags: ["data", "machinelearning", "science"],
  },
  {
    id: "4",
    name: "Data Army",
    description: "Data science compass for young Cameroonians",
    tags: ["data", "machinelearning", "science"],
  },
];

const StreamSidebar: React.FC = () => {
  return (
    <div className="sticky top-0  bg-background hidden lg:block p-4 ">
      <div className="w-full h-full flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-neutral-200 dark:text-neutral-200">
            Streams Like This
          </h3>
          <div className="mb-6">
            {mockStreams.map((stream) => (
              <AuthorListItemNoCheckbox key={stream.id} author={stream} />
            ))}
          </div>
        </div>

         <div className=" p-4 bg-gray-750 text-neutral-200">
                <ul className="space-y-2">
                    <li>
                        <a href="#" className="flex items-center py-2 px-3  rounded-lg transition-all duration-200">
                            <i className="fas fa-users-cog mr-3"></i>
                            <span>Manage Authors</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center py-2 px-3 rounded-lg transition-all duration-200">
                            <i className="fas fa-trash-alt mr-3"></i>
                            <span>Delete Stream</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center py-2 px-3 rounded-lg transition-all duration-200">
                            <i className="fas fa-file-contract mr-3"></i>
                            <span>Terms and Policies</span>
                        </a>
                    </li>
                </ul>
            </div>
      </div>
    </div>
  );
};

export default StreamSidebar;
