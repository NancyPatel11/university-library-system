import React from "react";
import { Button } from "@/components/ui/button";
import bookicon from "@/assets/icons/logo.svg";
import closeIcon from "@/assets/icons/admin/close.svg";
import receiptBg from "@/assets/images/receipt-bg.png";

export const ReceiptModal = ({ selectedReceiptRequest, onClose, downloadReceiptAsPNG }) => {
    if (!selectedReceiptRequest) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
            <div className="relative bg-white w-[625px] p-8 rounded-lg shadow-lg">
                <Button
                    onClick={onClose}
                    className="absolute top-1 right-0 bg-transparent hover:bg-gray-100 shadow-none hover:cursor-pointer"
                >
                    <img src={closeIcon} alt="close" className="h-3 w-3" />
                </Button>

                <div id="receipt" className="bg-admin-receipt-bg p-5">
                    <div
                        className="h-full bg-center bg-no-repeat p-8 text-white"
                        style={{
                            backgroundImage: `url(${receiptBg})`,
                            backgroundSize: "cover",
                            backgroundPosition: "top",
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <img src={bookicon} alt="book icon" className="h-8" />
                            <h3 className="ibm-plex-sans-500 text-3xl">
                                <a href="/home">Bookademia</a>
                            </h3>
                        </div>

                        <div>
                            <h1 className="text-2xl mt-6">Borrow Receipt</h1>
                            <p className="text-lg ibm-plex-sans-300 mt-2">
                                Date Issued:
                                <span className="ps-2 ibm-plex-sans-500 text-yellow">
                                    {new Date().toLocaleDateString("en-GB")}
                                </span>
                            </p>
                            <p className="text-lg ibm-plex-sans-300 mt-2">
                                Issued for:
                                <span className="ps-2 ibm-plex-sans-500 text-yellow">
                                    {selectedReceiptRequest.studentFullName} ({selectedReceiptRequest.studentEmail})
                                </span>
                            </p>
                        </div>

                        <hr className="my-5" style={{ border: "none", height: "1px", backgroundColor: "#D6E0FF1A" }} />

                        <div className="text-gray-300 ibm-plex-sans-300">
                            <h1 className="text-xl text-white mb-2 ibm-plex-sans-500">Book Details</h1>
                            <div className="space-y-1 pl-2">
                                <div className="flex items-start gap-2">
                                    <span className="text-white">•</span>
                                    <span>Title: <span className="ibm-plex-sans-500 text-white">{selectedReceiptRequest.bookTitle}</span></span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-white">•</span>
                                    <span>Author: <span className="ibm-plex-sans-500 text-white">{selectedReceiptRequest.bookAuthor}</span></span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-white">•</span>
                                    <span>Borrowed On: <span className="ibm-plex-sans-500 text-white">{new Date(selectedReceiptRequest.issueDate).toLocaleDateString()}</span></span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-white">•</span>
                                    <span>Due Date: <span className="ibm-plex-sans-500 text-white">{new Date(selectedReceiptRequest.dueDate).toLocaleDateString()}</span></span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-white">•</span>
                                    <span>Return Date:
                                        {selectedReceiptRequest.returnDate ?
                                            <span className="ibm-plex-sans-500 text-white">
                                                {new Date(selectedReceiptRequest.dueDate).toLocaleDateString()}
                                            </span>
                                            :
                                            <span className="ibm-plex-sans-500 text-white"> Not Yet Returned</span>
                                        }
                                    </span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-white">•</span>
                                    <span>Status: <span className="ibm-plex-sans-500 text-white">{selectedReceiptRequest.status}</span></span>
                                </div>
                            </div>
                        </div>

                        <hr className="my-5" style={{ border: "none", height: "1px", backgroundColor: "#D6E0FF1A" }} />

                        <div className="text-gray-300 ibm-plex-sans-300">
                            <h1 className="text-xl text-white mb-2 ibm-plex-sans-500">Terms</h1>
                            <div className="space-y-1 pl-2">
                                <div className="flex items-start gap-2">
                                    <span className="text-white">•</span>
                                    Ensure the book is returned by the due date.
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-white">•</span>
                                    Late returns may incur fines.
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-white">•</span>
                                    Lost or damaged books may incur replacement costs.
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-white">•</span>
                                    Contact us for any issues or concerns.
                                </div>
                            </div>
                        </div>

                        <hr className="my-5" style={{ border: "none", height: "1px", backgroundColor: "#D6E0FF1A" }} />

                        <div className="text-gray-300 ibm-plex-sans-300">
                            <p>
                                Thank you for using <span className="ibm-plex-sans-500 text-white">Bookademia!</span>
                            </p>
                            <p>
                                Website: <span className="ibm-plex-sans-500 text-white">bookademia.example.com</span>
                            </p>
                            <p>
                                Email: <span className="ibm-plex-sans-500 text-white">nancypatel5757@gmail.com</span>
                            </p>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={downloadReceiptAsPNG}
                    className="mt-6 w-full bg-admin-primary-blue text-white hover:bg-admin-tertiary-blue hover:cursor-pointer"
                >
                    Download Receipt
                </Button>
            </div>
        </div>
    );
};
