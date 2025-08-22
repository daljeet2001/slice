# Slice - Bill Splitter App

Slice is a modern bill splitting application that makes it easy to scan, split, and share expenses with friends. Powered by OCR, it reads totals directly from your bill images, lets you add friends, and split the bill equally or with custom amounts.

## Features

- **Bill Scanning:** Upload a photo of your bill; Slice uses Tesseract OCR to extract the total.
- **Smart Total Detection:** Automatically finds and suggests the "Total to Pay" from the scanned bill.
- **Friend Management:** Add and select friends to split bills with.
- **Flexible Splitting:** Split the bill equally or assign custom amounts to each friend.
- **Bill History:** View all your past bills and how they were split.

## Tech Stack

- **Frontend:** React, Tailwind CSS, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **OCR:** Tesseract.js (server-side)

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB instance (local or cloud)

### Setup

#### 1. Clone the repository

```sh
git clone https://github.com/yourusername/slice.git
cd slice