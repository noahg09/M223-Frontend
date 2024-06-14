import React, { useState, useEffect } from 'react';
import styles from './folderList.module.css';

interface Folder {
    id: number;
    title: string;
}

interface Document {
    id: number;
    title: string;
    size: number;
}

function FolderList() {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [totalSize, setTotalSize] = useState<number>(0);

    const token = sessionStorage.getItem('token');

    useEffect(() => {
        fetch('http://localhost:8080/docFolders', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => setFolders(data))
            .catch(error => console.error('Error fetching folders:', error));
    }, [token]);

    const handleFolderClick = (folderId: number) => {
        setSelectedFolder(folderId);

        fetch(`http://localhost:8080/docFolders/${folderId}/documents`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => setDocuments(data))
            .catch(error => console.error('Error fetching documents:', error));

        fetch(`http://localhost:8080/docFolders/${folderId}/totalSize`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => setTotalSize(data))
            .catch(error => console.error('Error fetching total size:', error));
    };

    return (
        <div>
            <h1>Folder List</h1>
            <ul className={styles.folderList}>
                {folders.map(folder => (
                    <li key={folder.id} onClick={() => handleFolderClick(folder.id)} className={styles.folderItem}>
                        {folder.title} - Total Size: {folder.id === selectedFolder ? totalSize : 'Loading...'} KB
                    </li>
                ))}
            </ul>
            {selectedFolder && (
                <div>
                    <h2>Documents in Folder</h2>
                    <ul className={styles.folderList}>
                        {documents.map(doc => (
                            <li key={doc.id} className={styles.folderItem}>{doc.title} - {doc.size} KB</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default FolderList;