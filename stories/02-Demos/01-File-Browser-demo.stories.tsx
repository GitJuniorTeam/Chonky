import 'chonky/style/main.css';

import {
    ChonkyActions,
    FileActionHandler,
    FileArray,
    FileBrowser,
    FileData,
    FileHelper,
    FileList,
    FileSearch,
    FileToolbar,
} from 'chonky';
import React, { useCallback, useMemo, useState } from 'react';
import { Nullable } from 'tsdef';

import {
    createDocsObject,
    showActionNotification,
    StoryCategories,
} from '../story-helpers';
// @ts-ignore
// eslint-disable-next-line
import markdown from './01-File-Browser-demo.md';
import ChonkySourceCodeFsMap from './chonky_source.fs_map.json';

const category = StoryCategories.Demos;
const title = 'File Browser demo';

// eslint-disable-next-line import/no-default-export
export default {
    title: `${category}|${title}`,
    parameters: {
        docs: createDocsObject({ markdown }),
    },
};

export const FileBrowserDemo: React.FC = () => {
    const [currentFolderId, setCurrentFolderId] = useState(rootDemoFolder.id);

    const files = useFiles(currentFolderId);
    const folderChain = useFolderChain(currentFolderId);

    const handleFileAction = useCallback<FileActionHandler>(
        (action, actionData) => {
            if (action.id === ChonkyActions.OpenFiles.id) {
                let targetFile: Nullable<FileData> = null;
                if (actionData.target) {
                    targetFile = actionData.target;
                } else if (actionData.files && actionData.files.length === 1) {
                    targetFile = actionData.files[0];
                }

                if (targetFile && FileHelper.isDirectory(targetFile)) {
                    setCurrentFolderId(targetFile.id);
                    return;
                }
            }

            showActionNotification({ action, data: actionData });
        },
        [setCurrentFolderId]
    );

    return (
        <div style={{ height: 600 }}>
            <FileBrowser
                files={files}
                folderChain={folderChain}
                onFileAction={handleFileAction}
                enableDragAndDrop={true}
            >
                <FileToolbar />
                <FileSearch />
                <FileList />
            </FileBrowser>
        </div>
    );
};

const rootDemoFolder = {
    id: 'qwerty123456',
    name: 'Chonky Demo',
    isDir: true,
    childrenIds: [ChonkySourceCodeFsMap.rootFolderId],
};
const demoFileMap = {
    [rootDemoFolder.id]: rootDemoFolder,
    ...ChonkySourceCodeFsMap.fileMap,
};
demoFileMap[ChonkySourceCodeFsMap.rootFolderId].parentId = rootDemoFolder.id;

const useFiles = (currentFolderId: string): FileArray => {
    return useMemo(() => {
        const currentFolder = demoFileMap[currentFolderId];
        const files = !currentFolder.childrenIds
            ? []
            : currentFolder.childrenIds.map((fileId) => {
                  const file = demoFileMap[fileId];
                  return file ? file : null;
              });
        return files;
    }, [currentFolderId]);
};

const useFolderChain = (currentFolderId: string): FileArray => {
    return useMemo(() => {
        const currentFolder = demoFileMap[currentFolderId];

        const folderChain = [currentFolder];

        let parentId = currentFolder.parentId;
        while (parentId) {
            const parentFile = demoFileMap[parentId];
            if (parentFile) {
                folderChain.unshift(parentFile);
                parentId = parentFile.parentId;
            } else {
                parentId = null;
            }
        }

        return folderChain;
    }, [currentFolderId]);
};
