// Menunggu hingga seluruh konten halaman dimuat
document.addEventListener('DOMContentLoaded', function() {

    // Hanya jalankan kode ini jika kita berada di halaman tulisan
    // Kita cek dengan keberadaan elemen .story-list
    const storyList = document.querySelector('.story-list');
    if (!storyList) {
        return; // Keluar dari fungsi jika bukan halaman tulisan
    }

    const storyLinks = document.querySelectorAll('.story-link');
    const storyContent = document.getElementById('story-content');

    // Tambahkan event listener untuk setiap link cerita
    storyLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // Mencegah link melakukan navigasi default
            event.preventDefault(); 

            // Ambil path file dari atribut 'data-source'
            const sourceFile = this.getAttribute('data-source');
            
            // Tampilkan pesan loading
            storyContent.innerHTML = '<p>Memuat cerita...</p>';

            // Gunakan Fetch API untuk mengambil konten file .txt
            fetch(sourceFile)
                .then(response => {
                    // Cek jika file tidak ditemukan (error 404)
                    if (!response.ok) {
                        throw new Error('File tidak ditemukan. Pastikan path di atribut data-source benar.');
                    }
                    return response.text();
                })
                .then(text => {
                    // Tampilkan teks dari file ke dalam area konten
                    storyContent.textContent = text;
                })
                .catch(error => {
                    // Tampilkan pesan error jika gagal mengambil file
                    console.error('Error fetching the story:', error);
                    storyContent.innerHTML = `<p style="color: red;">Dumbass forgot to place the story in the right path.</p>`;
                });
        });
    });
});
