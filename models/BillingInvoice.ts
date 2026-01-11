import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';
import { IContract } from './Contract';

export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'overdue' | 'void';

export interface IInvoiceItem {
  label: string;
  amount: number;
}

export interface IBillingInvoice extends Document {
  userId: mongoose.Types.ObjectId | IUser;
  contractId?: mongoose.Types.ObjectId | IContract;
  invoiceNumber: string;
  items: IInvoiceItem[];
  amountDue: number;
  currency: string;
  dueDate: Date;
  status: InvoiceStatus;
  issuedAt: Date;
  paidAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceItemSchema = new Schema<IInvoiceItem>(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const BillingInvoiceSchema: Schema<IBillingInvoice> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contractId: {
      type: Schema.Types.ObjectId,
      ref: 'Contract',
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    items: {
      type: [InvoiceItemSchema],
      default: [],
    },
    amountDue: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'PHP',
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'issued', 'paid', 'overdue', 'void'],
      default: 'issued',
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    paidAt: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const BillingInvoice: Model<IBillingInvoice> =
  mongoose.models.BillingInvoice || mongoose.model<IBillingInvoice>('BillingInvoice', BillingInvoiceSchema);

export default BillingInvoice;
