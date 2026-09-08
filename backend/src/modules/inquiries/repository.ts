import { inquiries } from '../../db/schema.js';
import { randomUUID } from 'node:crypto';
import type { Database } from '../../db/client.js';
import type { InquiryInput } from './schema.js';

export type StoredInquiry = { id: string; createdAt: Date };
export interface InquiryRepository {
  create(inquiry: InquiryInput): Promise<StoredInquiry>;
}
export class PostgresInquiryRepository implements InquiryRepository {
  constructor(private readonly db: Database) {}
  async create(inquiry: InquiryInput): Promise<StoredInquiry> {
    const [created] = await this.db
      .insert(inquiries)
      .values({
        company: inquiry.company,
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone || null,
        projectType: inquiry.projectType,
        budget: inquiry.budget || null,
        message: inquiry.message,
        privacyAcceptedAt: new Date(),
      })
      .returning({ id: inquiries.id, createdAt: inquiries.createdAt });
    if (!created) throw new Error('Kontaktanfrage konnte nicht gespeichert werden.');
    return created;
  }
}
export class DevelopmentInquiryRepository implements InquiryRepository {
  private readonly data: StoredInquiry[] = [];
  async create(): Promise<StoredInquiry> {
    const inquiry = { id: randomUUID(), createdAt: new Date() };
    this.data.push(inquiry);
    return inquiry;
  }
}
