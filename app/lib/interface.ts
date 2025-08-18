/* eslint-disable @typescript-eslint/no-explicit-any */
import { OutputData } from "@editorjs/editorjs";
import { FieldErrors, FieldValues, SubmitHandler, UseFormRegister } from "react-hook-form";

// Enums
export enum UserRole {
  USER = 'USER',
  VIP = 'VIP',
  ADMIN = 'ADMIN'
}

export enum PredictionResult {
  PENDING = 'PENDING',
  WON = 'WON',
  LOST = 'LOST'
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

export enum SubscriptionPlan {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY'
}

// Base interfaces for common properties
export interface BaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}


// Main interfaces
export interface User extends BaseModel {
  [x: string]: any; // Allow additional properties
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  predictions?: Prediction[];
  subscriptions?: Subscription[];
  payments?: Payment[];
  emailVerified: boolean;
  location: string;
  notifications?: Notification[];
  blogPosts?: BlogPost[];
}

export interface Prediction {
  [x: string]: any;
  league: string;
  sportType: string;
  homeTeam: string;
  awayTeam: string;
  tip: string;
  analysis?: string;
  odds?: number | string;
  result: PredictionResult;
  publishedAt: Date;
  createdBy?: User;
  userId: string;
  gameType: string
  league_rel?: League;
  validation?: ValidationRules
}

export interface Subscription extends BaseModel {
  user?: User;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startedAt: Date;
  expiresAt: Date;
  flutterwavePaymentId?: string;
}

export interface Payment extends BaseModel {
  user?: User;
  userId: string;
  amount: number;
  currency: string;
  provider: string;
  status: PaymentStatus;
  reference: string;
}

export interface League extends BaseModel {
  name: string;
  predictions?: Prediction[];
}

export interface Settings extends BaseModel {
  key: string;
  value: string;
  description?: string;
}

export interface Notification extends BaseModel {
  user?: User;
  userId: string;
  message: string;
  read: boolean;
}



export interface BlogPost {
  [x: string]: any
  title: string;
  content: string;
  author?: User;
  slug: string;
  summary: string;
  image?: string;
  category: string
  publishedAt?: Date;
  tags: string | string[];
  status: 'draft' | 'published' | 'archived';
}

// Request/Response interfaces
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  orderBy?: {
    [key: string]: 'asc' | 'desc';
  };
}

// Create DTOs (Data Transfer Objects)
export interface CreateUserDTO {
  email: string;
  passwordHash: string;
  role?: UserRole;
  location?: string;
}

export interface CreatePredictionDTO {
  [x: string]: any;
  league: string;
  homeTeam: string;
  awayTeam: string;
  tip: string;
  analysis?: string;
  odds?: string;
  publishedAt: Date;
  userId: string;
  gameType?: string;
}

export interface CreateSubscriptionDTO {
  userId: string;
  plan: SubscriptionPlan;
  startedAt: Date;
  expiresAt: Date;
  flutterwavePaymentId?: string;
}

export interface CreatePaymentDTO {
  userId: string;
  amount: number;
  currency: string;
  provider?: string;
  status: PaymentStatus;
  reference: string;
}

export interface CreateBlogPostDTO {
  title: string;
  content: string;
  authorId: string;
}

export interface CreateNotificationDTO {
  userId: string;
  message: string;
}

// Update DTOs
export type UpdateUserDTO = Partial<CreateUserDTO>;
export type UpdatePredictionDTO = Partial<CreatePredictionDTO>;
export type UpdateSubscriptionDTO = Partial<CreateSubscriptionDTO>;
export type UpdatePaymentDTO = Partial<CreatePaymentDTO>;
export type UpdateBlogPostDTO = Partial<CreateBlogPostDTO>;
export type UpdateNotificationDTO = Partial<CreateNotificationDTO>;

// Filter interfaces
export interface PredictionFilters extends PaginationQuery {
  league?: string;
  result?: PredictionResult;
  gameType?: string;
  userId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface SubscriptionFilters extends PaginationQuery {
  status?: SubscriptionStatus;
  plan?: SubscriptionPlan;
  userId?: string;
}

export interface PaymentFilters extends PaginationQuery {
  status?: PaymentStatus;
  userId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface BlogPostFilters extends PaginationQuery {
  authorId?: string;
  searchTerm?: string;
}

export interface NotificationFilters extends PaginationQuery {
  userId?: string;
  read?: boolean;
}

// API Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Dashboard specific interfaces
export interface DashboardStats {
  totalPredictions: number;
  wonPredictions: number;
  lostPredictions: number;
  pendingPredictions: number;
  winRate: number;
  totalSubscribers: number;
  activeSubscribers: number;
  totalRevenue: number;
  recentPayments: Payment[];
  recentPredictions: Prediction[];
}

export interface UserStats {
  totalPredictions: number;
  successRate: number;
  subscription?: Subscription;
  recentPredictions: Prediction[];
  recentPayments: Payment[];
}



export interface ValidationRules {
  required?: boolean | string;
  min?: number | string;
  max?: number | string;
  minLength?: number | string;
  maxLength?: number | string;
  pattern?: {
    value: RegExp;
    message: string;
  };
  validate?: (value: unknown) => boolean | string | Promise<boolean | string>;
}

export interface SchemaField extends ValidationRules {
  type: 'text' | 'number' | 'email' | 'password' | 'date' | 'datetime-local' | 'select' | 'grouped-select' | 'textarea' | 'checkbox' | 'editor';
  label: string;
  validation?: ValidationRules;
  required?: boolean;
  options?: { label: string; value: string | number }[];
  description?: string;
  disabled?: boolean;
  hidden?: boolean;
  placeholder?: string;
}

export type SchemaDefinition<T extends FieldValues> = {
  [K in keyof T]: SchemaField;

};

export interface DynamicFormProps<TFieldValues extends FieldValues> {
  schema: SchemaDefinition<TFieldValues>;
  onSubmit: SubmitHandler<TFieldValues>;
  initialData?: Partial<TFieldValues>;
  submitLabel?: string;
  className?: string;
  isSubmitting?: boolean;
  onCancel?: () => void;
  cancelLabel?: string;
}

export interface FormFieldProps {
  type: 'text' | 'number' | 'email' | 'password' | 'date' | 'datetime-local' | 'select' | 'grouped-select' | 'textarea' | 'checkbox' | 'editor';
  name: string;
  label: string;
  register: UseFormRegister<FieldValues>;
  error?: FieldErrors;
  required?: boolean;
  options?: { label: string; value: string | number }[];
  disabled?: boolean;
  hidden?: boolean;
  placeholder?: string;
  className?: string;
  OutputData?: (data: OutputData) => void;
  control?: any;
}


//analytics
export interface AnalyticsOptions {
  dateRange?: {
    start: Date;
    end: Date;
  };
  groupBy?: 'day' | 'week' | 'month' | 'year';
  limit?: number;
  orderBy?: Record<string, 'asc' | 'desc'>;
  include?: Record<string, any>;
  where?: Record<string, any>;
}

export interface AnalyticsResult<T = any> {
  success: boolean;
  data?: T;
  metrics?: {
    total: number;
    growth?: number;
    growthPercentage?: number;
    average?: number;
    peak?: number;
    trend?: 'up' | 'down' | 'stable';
  };
  history?: Array<{
    period: string;
    value: number;
    date: Date;
  }>;
  error?: any;
}



export interface TimeEstimate {
  minutes: number;
  seconds: number;
  totalSeconds: number;
  formattedTime: string;
}

export interface ReadingOptions {
  wordsPerMinute?: number;
  includeSeconds?: boolean;
  roundUp?: boolean;
}

export interface SpeakingOptions {
  wordsPerMinute?: number;
  includeSeconds?: boolean;
  roundUp?: boolean;
}

export interface Comment {
  id: string;
  user: User;
  userId: string;
  predictionId?: string | null;
  blogPostId?: string | null;
  prediction?: Prediction | null;
  blogPost?: BlogPost | null;
  content: string;
  parentCommentId?: string | null;
  parentComment?: Comment | null;
  replies?: Comment[];
  createdAt: Date;
  updatedAt: Date
  CommentEngagement?: CommentEngagement[];
}

export interface CommentEngagement {
  id: string
  user: User
  userId: string
  comment: Comment
  commentId: string
  type: string
  createdAt: Date
}


export interface PricingPlan {
  [x: string]: any,
  name: string,
  price: number,
  currency: string,
  plan: 'DAILY' | 'WEEKLY',
  features: string[],
  isPopular: false,
}