export const format = (data) => {
    const date = new Date(data);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

export const download = (e, originalImage) => {
    e.preventDefault();
    try {
        fetch(originalImage)
            .then(resp => {
                if (!resp.ok) {
                    throw new Error('Network response was not ok');
                }
                return resp.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = "none";
                a.href = url;
                const nameSplit = originalImage.split('/');
                const duplicate = nameSplit.pop();
                a.download = duplicate;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.error('Error downloading file:', error);
            });
    } catch (error) {
        console.error('Error in download function:', error);
    }
}
