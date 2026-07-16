import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Eye,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Star,
  Info,
  Printer,
  Tag,
  Award,
  X
} from 'lucide-react';
import useArtworksStore from '../../store/artworksStore';
import ArtworkForm from './ArtworkForm';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { formatPrice } from '../../utils/formatters';

const AdminArtworks = () => {
  const { 
    artworks, 
    filteredArtworks,
    loading,
    fetchArtworks,
    setSearchTerm,
    setSelectedCategory,
    selectedCategory,
    deleteArtwork,
    getCategories
  } = useArtworksStore();
  
  // Orden por código (AA00 → ZZ99) por default
  const sortedArtworks = [...filteredArtworks].sort((a, b) =>
    (a.code || '').localeCompare(b.code || '', undefined, { numeric: true, sensitivity: 'base' })
  );

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedArtworks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedArtworks = sortedArtworks.slice(startIndex, endIndex);

  const [showForm, setShowForm] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingArtwork, setDeletingArtwork] = useState(null);
  const [notification, setNotification] = useState(null);
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [printModal, setPrintModal] = useState({ show: false, type: null });

  useEffect(() => {
    fetchArtworks({ limit: 100 }); // Obtener hasta 100 obras
  }, [fetchArtworks]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, filteredArtworks.length]);

  // Obtener categorías dinámicas del store
  const categories = getCategories();

  const handleCreate = () => {
    setEditingArtwork(null);
    setShowForm(true);
  };

  const handleEdit = (artwork) => {
    setEditingArtwork(artwork);
    setShowForm(true);
  };

  const handleDelete = (artwork) => {
    setDeletingArtwork(artwork);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deletingArtwork) return;

    try {
      const response = await deleteArtwork(deletingArtwork.id);
      if (response.success) {
        showNotification('success', 'Obra eliminada exitosamente');
      }
    } catch (error) {
      showNotification('error', error.message || 'Error al eliminar la obra');
    } finally {
      setShowDeleteDialog(false);
      setDeletingArtwork(null);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFormSuccess = (message) => {
    showNotification('success', message);
  };

  const handleFormError = (message) => {
    showNotification('error', message);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    // Debounce the search
    const timeoutId = setTimeout(() => {
      setSearchTerm(value);
    }, 300);
    return () => clearTimeout(timeoutId);
  };

  const stats = {
    total: artworks.length,
    available: artworks.filter(a => a.available).length,
    sold: artworks.filter(a => !a.available).length,
    totalValue: artworks.reduce((sum, a) => sum + a.price, 0),
    currency: artworks.length > 0 ? artworks[0].currency || 'ARS' : 'ARS'
  };

  const handlePrint = (onlyAvailable = false) => {
    // Usar las obras filtradas actualmente, opcionalmente solo disponibles
    const artworksToPrint = onlyAvailable
      ? filteredArtworks.filter(a => a.available)
      : filteredArtworks;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showNotification('error', 'No se pudo abrir la ventana de impresión. Verifica que los popups estén habilitados.');
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Listado de Obras - Mirta Aguilar</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 16px;
            line-height: 1.5;
            color: #333;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 2px solid #333;
          }
          .header h1 {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 8px;
          }
          .header p {
            color: #666;
            font-size: 18px;
          }
          .stats {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin-bottom: 25px;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 5px;
          }
          .stat-item {
            text-align: center;
          }
          .stat-value {
            font-size: 28px;
            font-weight: bold;
          }
          .stat-label {
            font-size: 14px;
            color: #666;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 15px 12px;
            text-align: left;
            font-size: 18px;
          }
          th {
            background-color: #333;
            color: white;
            font-weight: 600;
            font-size: 16px;
            text-transform: uppercase;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          tr:hover {
            background-color: #f0f0f0;
          }
          .code {
            font-family: 'Courier New', monospace;
            font-weight: bold;
            font-size: 17px;
            background: #e8e8e8;
            padding: 4px 8px;
            border-radius: 3px;
          }
          .artwork-img {
            width: 200px;
            height: 200px;
            object-fit: cover;
            border-radius: 4px;
            border: 2px solid #333;
          }
          .status-available {
            color: #16a34a;
            font-weight: 600;
          }
          .status-sold {
            color: #dc2626;
            font-weight: 600;
          }
          .price {
            font-weight: 600;
            text-align: right;
          }
          .footer {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 10px;
            color: #666;
          }
          @media print {
            body { padding: 10px; }
            .no-print { display: none; }
            tr { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Catálogo de Obras</h1>
          <p>Mirta Aguilar - Galería de Arte</p>
        </div>

        <div class="stats">
          <div class="stat-item">
            <div class="stat-value">${artworksToPrint.length}</div>
            <div class="stat-label">Total Obras</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${artworksToPrint.filter(a => a.available).length}</div>
            <div class="stat-label">Disponibles</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${artworksToPrint.filter(a => !a.available).length}</div>
            <div class="stat-label">Vendidas</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${formatPrice(artworksToPrint.reduce((sum, a) => sum + a.price, 0), stats.currency)}</div>
            <div class="stat-label">Valor Total</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 210px;">Imagen</th>
              <th style="width: 70px;">Código</th>
              <th>Título</th>
              <th style="width: 100px;">Categoría</th>
              <th style="width: 120px;">Técnica</th>
              <th style="width: 90px;">Dimensiones</th>
              <th style="width: 50px;">Año</th>
              <th style="width: 90px;">Precio</th>
              <th style="width: 70px;">Estado</th>
            </tr>
          </thead>
          <tbody>
            ${artworksToPrint.map(artwork => `
              <tr>
                <td><img src="${artwork.thumbnailUrl || artwork.imageUrl}" alt="${artwork.title}" class="artwork-img" /></td>
                <td><span class="code">${artwork.code || '-'}</span></td>
                <td>${artwork.title}</td>
                <td>${artwork.category ? artwork.category.charAt(0).toUpperCase() + artwork.category.slice(1) : '-'}</td>
                <td>${artwork.technique || '-'}</td>
                <td>${artwork.dimensions || '-'}</td>
                <td>${artwork.year || '-'}</td>
                <td class="price">${formatPrice(artwork.price, artwork.currency)}</td>
                <td class="${artwork.available ? 'status-available' : 'status-sold'}">
                  ${artwork.available ? 'Disponible' : 'Vendida'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Generado el ${new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          <p>www.mirtaaguilar.art</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const handlePrintLabels = (onlyAvailable = false) => {
    const artworksToPrint = onlyAvailable
      ? filteredArtworks.filter(a => a.available)
      : filteredArtworks;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showNotification('error', 'No se pudo abrir la ventana de impresión. Verifica que los popups estén habilitados.');
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Etiquetas de Obras - Mirta Aguilar</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 10mm;
            background: #fff;
          }
          .labels-container {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8mm;
          }
          .label {
            border: 2px solid #333;
            border-radius: 8px;
            padding: 12px;
            page-break-inside: avoid;
            background: #fff;
            min-height: 65mm;
            display: flex;
            flex-direction: column;
          }
          .label-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 2px dashed #ccc;
          }
          .label-code {
            font-family: 'Courier New', monospace;
            font-size: 32px;
            font-weight: bold;
            background: #1a1a1a;
            color: #fff;
            padding: 8px 16px;
            border-radius: 6px;
            letter-spacing: 2px;
          }
          .label-year {
            font-size: 18px;
            font-weight: 600;
            color: #666;
            padding: 8px 12px;
            background: #f0f0f0;
            border-radius: 4px;
          }
          .label-title {
            font-size: 20px;
            font-weight: bold;
            color: #1a1a1a;
            margin-bottom: 8px;
            line-height: 1.3;
          }
          .label-artist {
            font-size: 14px;
            color: #666;
            font-style: italic;
            margin-bottom: 12px;
          }
          .label-details {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
          .label-row {
            display: flex;
            font-size: 13px;
          }
          .label-field {
            font-weight: 600;
            color: #333;
            min-width: 85px;
          }
          .label-value {
            color: #555;
          }
          .label-brand {
            font-size: 10px;
            color: #999;
            text-align: center;
            margin-top: 8px;
          }
          @media print {
            body {
              padding: 5mm;
            }
            .labels-container {
              gap: 5mm;
            }
            .label {
              border-width: 1.5px;
              min-height: 60mm;
            }
            .no-print {
              display: none;
            }
          }
          @page {
            size: A4;
            margin: 10mm;
          }
        </style>
      </head>
      <body>
        <div class="labels-container">
          ${artworksToPrint.map(artwork => `
            <div class="label">
              <div class="label-header">
                <div class="label-code">${artwork.code || '---'}</div>
                <div class="label-year">${artwork.year || '-'}</div>
              </div>
              <div class="label-title">${artwork.title}</div>
              <div class="label-artist">${artwork.artist || 'Mirta Aguilar'}</div>
              <div class="label-details">
                <div class="label-row">
                  <span class="label-field">Dimensiones:</span>
                  <span class="label-value">${artwork.dimensions || '-'}</span>
                </div>
                <div class="label-row">
                  <span class="label-field">Categoría:</span>
                  <span class="label-value">${artwork.category ? artwork.category.charAt(0).toUpperCase() + artwork.category.slice(1) : '-'}</span>
                </div>
              </div>
              <div class="label-brand">www.mirtaaguilar.art</div>
            </div>
          `).join('')}
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const handlePrintSingleCertificate = (artwork) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showNotification('error', 'No se pudo abrir la ventana de impresión. Verifica que los popups estén habilitados.');
      return;
    }

    const currentDate = new Date().toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificado - ${artwork.code || artwork.title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Display:wght@500;700&display=swap" rel="stylesheet">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Georgia', 'Times New Roman', serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #fff;
          }
          .certificate {
            border: 2px solid #1a1a1a;
            padding: 12px;
            width: 90mm;
            height: 60mm;
            display: flex;
            flex-direction: column;
            background: #fff;
            position: relative;
          }
          .cert-header {
            text-align: center;
            border-bottom: 1px solid #333;
            padding-bottom: 6px;
            margin-bottom: 6px;
          }
          .cert-logo {
            font-family: 'Noto Serif Display', Georgia, serif;
            font-stretch: extra-condensed;
            display: flex;
            flex-direction: column;
            align-items: center;
            line-height: 1;
          }
          .cert-logo-firstname {
            font-size: 15px;
            font-weight: 700;
            letter-spacing: 0.05em;
            color: #1a1a1a;
          }
          .cert-logo-lastname {
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.05em;
            color: #1a1a1a;
          }
          .cert-logo-subtitle {
            font-size: 5px;
            font-weight: 500;
            letter-spacing: 0.3em;
            color: #666;
            margin-top: 2px;
          }
          .cert-title {
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #1a1a1a;
            margin-top: 5px;
          }
          .cert-code {
            font-family: 'Courier New', monospace;
            font-size: 8px;
            font-weight: normal;
            color: #999;
            position: absolute;
            top: 8px;
            right: 10px;
          }
          .cert-artwork-title {
            font-size: 13px;
            font-weight: bold;
            font-style: italic;
            color: #1a1a1a;
            margin-bottom: 6px;
            margin-top: 6px;
            text-align: center;
          }
          .cert-details {
            flex: 1;
            border-top: 1px solid #ddd;
            border-bottom: 1px solid #ddd;
            padding: 6px 0;
            margin: 4px 0;
          }
          .cert-row {
            display: flex;
            font-size: 9px;
            margin-bottom: 3px;
          }
          .cert-field {
            font-weight: bold;
            color: #333;
            min-width: 65px;
          }
          .cert-value {
            color: #444;
          }
          .cert-footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: auto;
          }
          .cert-artist {
            text-align: left;
          }
          .cert-artist-name {
            font-size: 11px;
            font-weight: bold;
            font-style: italic;
          }
          .cert-artist-label {
            font-size: 8px;
            color: #666;
          }
          .cert-date {
            font-size: 8px;
            color: #666;
            text-align: right;
          }
          .cert-website {
            font-size: 7px;
            color: #888;
            text-align: center;
            margin-top: 4px;
          }
          @media print {
            body {
              min-height: auto;
            }
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <span class="cert-code">${artwork.code || '---'}</span>
          <div class="cert-header">
            <div class="cert-logo">
              <span class="cert-logo-firstname">MIRTA</span>
              <span class="cert-logo-lastname">AGUILAR</span>
              <span class="cert-logo-subtitle">ARTISTA PLÁSTICA</span>
            </div>
            <div class="cert-title">Certificado de Autenticidad</div>
          </div>
          <div class="cert-artwork-title">"${artwork.title}"</div>
          <div class="cert-details">
            <div class="cert-row">
              <span class="cert-field">Técnica:</span>
              <span class="cert-value">${artwork.technique || '-'}</span>
            </div>
            <div class="cert-row">
              <span class="cert-field">Dimensiones:</span>
              <span class="cert-value">${artwork.dimensions || '-'}</span>
            </div>
            <div class="cert-row">
              <span class="cert-field">Año:</span>
              <span class="cert-value">${artwork.year || '-'}</span>
            </div>
          </div>
          <div class="cert-footer">
            <div class="cert-artist">
              <div class="cert-artist-name">Mirta Aguilar</div>
              <div class="cert-artist-label">Artista</div>
            </div>
            <div class="cert-date">Fecha: ${currentDate}</div>
          </div>
          <div class="cert-website">www.mirtaaguilar.art</div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const openPrintModal = (type) => {
    setPrintModal({ show: true, type });
  };

  const closePrintModal = () => {
    setPrintModal({ show: false, type: null });
  };

  const executePrint = (onlyAvailable) => {
    const { type } = printModal;
    closePrintModal();

    switch (type) {
      case 'listado':
        handlePrint(onlyAvailable);
        break;
      case 'etiquetas':
        handlePrintLabels(onlyAvailable);
        break;
      case 'certificados':
        handlePrintCertificates(onlyAvailable);
        break;
      default:
        break;
    }
  };

  const handlePrintCertificates = (onlyAvailable = false) => {
    const artworksToPrint = onlyAvailable
      ? filteredArtworks.filter(a => a.available)
      : filteredArtworks;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showNotification('error', 'No se pudo abrir la ventana de impresión. Verifica que los popups estén habilitados.');
      return;
    }

    const currentDate = new Date().toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificados de Autenticidad - Mirta Aguilar</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Display:wght@500;700&display=swap" rel="stylesheet">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Georgia', 'Times New Roman', serif;
            padding: 10mm;
            background: #fff;
          }
          .certificates-container {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8mm;
          }
          .certificate {
            border: 2px solid #1a1a1a;
            padding: 12px;
            width: 90mm;
            height: 60mm;
            page-break-inside: avoid;
            display: flex;
            flex-direction: column;
            background: #fff;
          }
          .cert-header {
            text-align: center;
            border-bottom: 1px solid #333;
            padding-bottom: 6px;
            margin-bottom: 6px;
          }
          .cert-logo {
            font-family: 'Noto Serif Display', Georgia, serif;
            font-stretch: extra-condensed;
            display: flex;
            flex-direction: column;
            align-items: center;
            line-height: 1;
          }
          .cert-logo-firstname {
            font-size: 15px;
            font-weight: 700;
            letter-spacing: 0.05em;
            color: #1a1a1a;
          }
          .cert-logo-lastname {
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.05em;
            color: #1a1a1a;
          }
          .cert-logo-subtitle {
            font-size: 5px;
            font-weight: 500;
            letter-spacing: 0.3em;
            color: #666;
            margin-top: 2px;
          }
          .cert-title {
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #1a1a1a;
            margin-top: 5px;
          }
          .cert-code {
            font-family: 'Courier New', monospace;
            font-size: 8px;
            font-weight: normal;
            color: #999;
            position: absolute;
            top: 8px;
            right: 10px;
          }
          .cert-artwork-title {
            font-size: 13px;
            font-weight: bold;
            font-style: italic;
            color: #1a1a1a;
            margin-bottom: 6px;
            margin-top: 6px;
            text-align: center;
          }
          .cert-details {
            flex: 1;
            border-top: 1px solid #ddd;
            border-bottom: 1px solid #ddd;
            padding: 6px 0;
            margin: 4px 0;
          }
          .cert-row {
            display: flex;
            font-size: 9px;
            margin-bottom: 3px;
          }
          .cert-field {
            font-weight: bold;
            color: #333;
            min-width: 65px;
          }
          .cert-value {
            color: #444;
          }
          .cert-footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: auto;
          }
          .cert-artist {
            text-align: left;
          }
          .cert-artist-name {
            font-size: 11px;
            font-weight: bold;
            font-style: italic;
          }
          .cert-artist-label {
            font-size: 8px;
            color: #666;
          }
          .cert-date {
            font-size: 8px;
            color: #666;
            text-align: right;
          }
          .cert-website {
            font-size: 7px;
            color: #888;
            text-align: center;
            margin-top: 4px;
          }
          @media print {
            body {
              padding: 5mm;
            }
            .certificates-container {
              gap: 5mm;
            }
            .certificate {
              border-width: 1.5px;
            }
          }
          @page {
            size: A4;
            margin: 10mm;
          }
        </style>
      </head>
      <body>
        <div class="certificates-container">
          ${artworksToPrint.map(artwork => `
            <div class="certificate">
              <span class="cert-code">${artwork.code || '---'}</span>
              <div class="cert-header">
                <div class="cert-logo">
                  <span class="cert-logo-firstname">MIRTA</span>
                  <span class="cert-logo-lastname">AGUILAR</span>
                  <span class="cert-logo-subtitle">ARTISTA PLÁSTICA</span>
                </div>
                <div class="cert-title">Certificado de Autenticidad</div>
              </div>
              <div class="cert-artwork-title">"${artwork.title}"</div>
              <div class="cert-details">
                <div class="cert-row">
                  <span class="cert-field">Técnica:</span>
                  <span class="cert-value">${artwork.technique || '-'}</span>
                </div>
                <div class="cert-row">
                  <span class="cert-field">Dimensiones:</span>
                  <span class="cert-value">${artwork.dimensions || '-'}</span>
                </div>
                <div class="cert-row">
                  <span class="cert-field">Año:</span>
                  <span class="cert-value">${artwork.year || '-'}</span>
                </div>
              </div>
              <div class="cert-footer">
                <div class="cert-artist">
                  <div class="cert-artist-name">Mirta Aguilar</div>
                  <div class="cert-artist-label">Artista</div>
                </div>
                <div class="cert-date">Fecha: ${currentDate}</div>
              </div>
              <div class="cert-website">www.mirtaaguilar.art</div>
            </div>
          `).join('')}
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-gallery-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gallery-900 mb-2">
            Gestión de Obras
          </h1>
          <p className="text-gallery-600">
            Administra el catálogo completo de obras de arte
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-soft p-3 sm:p-4"
          >
            <h3 className="text-xs sm:text-sm font-medium text-gallery-600 mb-1">Total Obras</h3>
            <p className="text-xl sm:text-2xl font-bold text-gallery-900">{stats.total}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-soft p-3 sm:p-4"
          >
            <h3 className="text-xs sm:text-sm font-medium text-gallery-600 mb-1">Disponibles</h3>
            <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.available}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-soft p-3 sm:p-4"
          >
            <h3 className="text-xs sm:text-sm font-medium text-gallery-600 mb-1">Vendidas</h3>
            <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.sold}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-soft p-3 sm:p-4"
          >
            <h3 className="text-xs sm:text-sm font-medium text-gallery-600 mb-1">Valor Total</h3>
            <p className="text-lg sm:text-2xl font-bold text-gallery-900">
              {formatPrice(stats.totalValue, stats.currency)}
            </p>
          </motion.div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-xl shadow-soft p-4 mb-6">
          <div className="flex flex-col gap-4">
            {/* Search - Full width on mobile */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gallery-400" />
              <input
                type="text"
                value={localSearchTerm}
                onChange={handleSearchChange}
                placeholder="Buscar por código, título o descripción..."
                className="w-full pl-10 pr-4 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors text-sm sm:text-base"
              />
            </div>

            {/* Category Filter and Create Button */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="flex items-center space-x-3">
                <Filter className="h-5 w-5 text-gallery-600 hidden sm:block" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-1 sm:flex-none px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors text-sm sm:text-base"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={() => openPrintModal('listado')}
                  className="btn-secondary btn-sm w-full sm:w-auto justify-center"
                  title="Imprimir listado completo"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Listado
                </button>
                <button
                  onClick={() => openPrintModal('etiquetas')}
                  className="btn-secondary btn-sm w-full sm:w-auto justify-center"
                  title="Imprimir etiquetas para rotular obras"
                >
                  <Tag className="h-4 w-4 mr-2" />
                  Etiquetas
                </button>
                <button
                  onClick={() => openPrintModal('certificados')}
                  className="btn-secondary btn-sm w-full sm:w-auto justify-center"
                  title="Imprimir certificados de autenticidad"
                >
                  <Award className="h-4 w-4 mr-2" />
                  Certificados
                </button>
                <button
                  onClick={handleCreate}
                  className="btn-primary btn-sm w-full sm:w-auto justify-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Obra
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Artworks Table/Cards */}
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
              <p className="mt-4 text-gallery-600">Cargando obras...</p>
            </div>
          ) : filteredArtworks.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gallery-600">No se encontraron obras</p>
            </div>
          ) : (
            <>
              {/* Mobile Cards View */}
              <div className="md:hidden">
                <div className="divide-y divide-gallery-200">
                  {paginatedArtworks.map((artwork) => (
                    <motion.div
                      key={artwork.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4"
                    >
                      <div className="flex space-x-4">
                        {/* Image */}
                        <img
                          src={artwork.thumbnailUrl || artwork.imageUrl}
                          alt={artwork.title}
                          className="h-24 w-24 rounded-lg object-cover flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setSelectedImage({ url: artwork.imageUrl, title: artwork.title })}
                        />
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 mr-2">
                              {artwork.code && (
                                <span className="inline-flex px-2 py-0.5 text-xs font-mono font-semibold rounded bg-gallery-100 text-gallery-700 border border-gallery-200 mb-1">
                                  {artwork.code}
                                </span>
                              )}
                              <h3 className="text-sm font-medium text-gallery-900 truncate">
                                {artwork.title}
                              </h3>
                              <p className="text-xs text-gallery-500 mt-1">
                                {artwork.technique} • {artwork.dimensions}
                              </p>
                              <p className="text-xs text-gallery-400">
                                Año: {artwork.year}
                                {artwork.location && ` • ${artwork.location}`}
                              </p>
                            </div>
                            {artwork.featured && (
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                            )}
                          </div>
                          
                          {/* Tags */}
                          <div className="mt-2 flex items-center flex-wrap gap-2">
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gallery-100 text-gallery-800">
                              {categories.find(c => c.value === artwork.category)?.label || artwork.category}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              artwork.available
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {artwork.available ? 'Disponible' : 'Vendida'}
                            </span>
                          </div>
                          
                          <div className="mt-2">
                            <div className="text-sm font-medium text-gallery-900">
                              {formatPrice(artwork.price, artwork.currency)}
                            </div>
                            {artwork.discountPercentage > 0 && (
                              <div className="text-xs text-green-600">
                                {artwork.discountPercentage}% descuento
                              </div>
                            )}
                          </div>
                          
                          {/* Actions */}
                          <div className="mt-3 flex items-center space-x-3">
                            <button
                              onClick={() => window.open(`/obra/${artwork.id}`, '_blank')}
                              className="text-xs text-gallery-600 hover:text-gallery-900 font-medium"
                            >
                              Ver obra
                            </button>
                            <button
                              onClick={() => handleEdit(artwork)}
                              className="text-xs text-blue-600 hover:text-blue-900 font-medium"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handlePrintSingleCertificate(artwork)}
                              className="text-xs text-amber-600 hover:text-amber-900 font-medium"
                            >
                              Certificado
                            </button>
                            <button
                              onClick={() => handleDelete(artwork)}
                              className="text-xs text-red-600 hover:text-red-900 font-medium"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gallery-50 border-b border-gallery-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gallery-500 uppercase tracking-wider">
                        Código
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gallery-500 uppercase tracking-wider">
                        Imagen
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gallery-500 uppercase tracking-wider">
                        Información
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gallery-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gallery-500 uppercase tracking-wider">
                        <div className="flex items-center space-x-1">
                          <span>Destacada</span>
                          <div className="group relative">
                            <Info className="h-4 w-4 text-gallery-400 cursor-help" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gallery-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              Las obras destacadas aparecen en el carrusel principal de la página de inicio
                              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                                <div className="border-4 border-transparent border-t-gallery-900"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gallery-500 uppercase tracking-wider">
                        Precio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gallery-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gallery-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gallery-200">
                    {paginatedArtworks.map((artwork) => (
                      <tr key={artwork.id} className="hover:bg-gallery-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2.5 py-1 text-xs font-mono font-semibold rounded bg-gallery-100 text-gallery-700 border border-gallery-200">
                            {artwork.code || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={artwork.thumbnailUrl || artwork.imageUrl}
                            alt={artwork.title}
                            className="h-16 w-16 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setSelectedImage({ url: artwork.imageUrl, title: artwork.title })}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gallery-900">
                              {artwork.title}
                            </div>
                            <div className="text-sm text-gallery-500">
                              {artwork.technique} - {artwork.dimensions}
                            </div>
                            <div className="text-xs text-gallery-400">
                              Año: {artwork.year}
                              {artwork.location && ` • ${artwork.location}`}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gallery-100 text-gallery-800">
                            {categories.find(c => c.value === artwork.category)?.label || artwork.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {artwork.featured ? (
                            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mx-auto" />
                          ) : (
                            <span className="text-gallery-300">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gallery-900">
                              {formatPrice(artwork.price, artwork.currency)}
                            </div>
                            {artwork.discountPercentage > 0 && (
                              <div className="text-xs text-green-600">
                                {artwork.discountPercentage}% descuento
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            artwork.available
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {artwork.available ? 'Disponible' : 'Vendida'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => window.open(`/obra/${artwork.id}`, '_blank')}
                              className="btn-icon text-gallery-600 hover:text-gallery-900"
                              title="Ver"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(artwork)}
                              className="btn-icon text-blue-600 hover:text-blue-900"
                              title="Editar"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handlePrintSingleCertificate(artwork)}
                              className="btn-icon text-amber-600 hover:text-amber-900"
                              title="Certificado"
                            >
                              <Award className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(artwork)}
                              className="btn-icon text-red-600 hover:text-red-900"
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 border-t border-gallery-200 gap-4">
                  <div className="text-xs sm:text-sm text-gallery-600 text-center sm:text-left">
                    Mostrando {startIndex + 1} - {Math.min(endIndex, filteredArtworks.length)} de {filteredArtworks.length} obras
                  </div>
                  
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                        currentPage === 1 
                          ? 'text-gallery-300 cursor-not-allowed' 
                          : 'text-gallery-600 hover:bg-gallery-100'
                      }`}
                    >
                      <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                    
                    {/* Mobile: Show only current page */}
                    <div className="flex items-center space-x-1 sm:hidden">
                      <span className="px-3 py-1 text-sm">
                        {currentPage} / {totalPages}
                      </span>
                    </div>
                    
                    {/* Desktop: Show page numbers */}
                    <div className="hidden sm:flex items-center space-x-1">
                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-1 rounded-lg transition-colors ${
                                currentPage === page
                                  ? 'bg-accent text-white'
                                  : 'text-gallery-600 hover:bg-gallery-100'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return <span key={page} className="text-gallery-400">...</span>;
                        }
                        return null;
                      })}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                        currentPage === totalPages 
                          ? 'text-gallery-300 cursor-not-allowed' 
                          : 'text-gallery-600 hover:bg-gallery-100'
                      }`}
                    >
                      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <ArtworkForm
            artwork={editingArtwork}
            onClose={() => {
              setShowForm(false);
              setEditingArtwork(null);
            }}
            onSuccess={handleFormSuccess}
            onError={handleFormError}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {showDeleteDialog && (
          <DeleteConfirmDialog
            title="Eliminar Obra"
            message={`¿Estás seguro de que deseas eliminar "${deletingArtwork?.title}"? Esta acción no se puede deshacer.`}
            onConfirm={confirmDelete}
            onCancel={() => {
              setShowDeleteDialog(false);
              setDeletingArtwork(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Image Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <X className="h-8 w-8" />
              </button>
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
              <p className="text-white text-center mt-3 text-lg font-medium">
                {selectedImage.title}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg ${
              notification.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}>
              {notification.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span>{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Print Selection Modal */}
      <AnimatePresence>
        {printModal.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={closePrintModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gallery-900">
                  {printModal.type === 'listado' && 'Imprimir Listado'}
                  {printModal.type === 'etiquetas' && 'Imprimir Etiquetas'}
                  {printModal.type === 'certificados' && 'Imprimir Certificados'}
                </h3>
                <button
                  onClick={closePrintModal}
                  className="text-gallery-400 hover:text-gallery-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-sm text-gallery-600 mb-5">
                Selecciona qué obras deseas incluir:
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => executePrint(false)}
                  className="w-full flex items-center justify-between px-4 py-3 border-2 border-gallery-200 rounded-lg hover:border-accent hover:bg-accent/5 transition-colors group"
                >
                  <div className="text-left">
                    <div className="font-medium text-gallery-900 group-hover:text-accent">
                      Todas las obras
                    </div>
                    <div className="text-xs text-gallery-500">
                      Incluye disponibles y vendidas ({filteredArtworks.length} obras)
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gallery-400 group-hover:text-accent" />
                </button>

                <button
                  onClick={() => executePrint(true)}
                  className="w-full flex items-center justify-between px-4 py-3 border-2 border-gallery-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group"
                >
                  <div className="text-left">
                    <div className="font-medium text-gallery-900 group-hover:text-green-600">
                      Solo disponibles
                    </div>
                    <div className="text-xs text-gallery-500">
                      Excluye obras vendidas ({filteredArtworks.filter(a => a.available).length} obras)
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gallery-400 group-hover:text-green-500" />
                </button>
              </div>

              <button
                onClick={closePrintModal}
                className="w-full mt-4 px-4 py-2 text-sm text-gallery-600 hover:text-gallery-900 transition-colors"
              >
                Cancelar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminArtworks;