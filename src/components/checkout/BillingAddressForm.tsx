import React, { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { AddressData } from '../../types';

interface BillingAddressFormProps {
  shippingAddress: AddressData;
  initialData: AddressData;
  useSameAsShipping: boolean;
  onSubmit: (data: AddressData) => void;
  onBack: () => void;
  onToggleSameAsShipping: (useSame: boolean) => void;
}

interface FormErrors {
  [key: string]: string | undefined;
}

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export default function BillingAddressForm({
  shippingAddress,
  initialData,
  useSameAsShipping,
  onSubmit,
  onBack,
  onToggleSameAsShipping
}: BillingAddressFormProps) {
  const [formData, setFormData] = useState<AddressData>(
    useSameAsShipping ? shippingAddress : initialData
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when shipping address or toggle changes
  React.useEffect(() => {
    if (useSameAsShipping) {
      setFormData(shippingAddress);
      setErrors({});
    }
  }, [useSameAsShipping, shippingAddress]);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'fullName': {
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Full name must be at least 2 characters';
        if (value.trim().length > 100) return 'Full name must not exceed 100 characters';
        return undefined;
      }

      case 'email': {
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[\w.-]+@[\w.-]+\.\w+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return undefined;
      }

      case 'phone': {
        if (!value.trim()) return 'Phone number is required';
        const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-()]/g, ''))) return 'Please enter a valid phone number';
        return undefined;
      }

      case 'addressLine1': {
        if (!value.trim()) return 'Address is required';
        if (value.trim().length < 5) return 'Address must be at least 5 characters';
        if (value.trim().length > 100) return 'Address must not exceed 100 characters';
        return undefined;
      }

      case 'addressLine2': {
        if (value && value.length > 100) return 'Address line 2 must not exceed 100 characters';
        return undefined;
      }

      case 'city': {
        if (!value.trim()) return 'City is required';
        if (value.trim().length < 2) return 'City must be at least 2 characters';
        if (value.trim().length > 50) return 'City must not exceed 50 characters';
        return undefined;
      }

      case 'state': {
        if (!value.trim()) return 'State is required';
        return undefined;
      }

      case 'postalCode': {
        if (!value.trim()) return 'ZIP code is required';
        const zipRegex = /^\d{5}(-\d{4})?$/;
        if (!zipRegex.test(value)) return 'Please enter a valid ZIP code (12345 or 12345-6789)';
        return undefined;
      }

      case 'country': {
        if (!value.trim()) return 'Country is required';
        return undefined;
      }

      default:
        return undefined;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof AddressData] || '');
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting billing address:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing Address</h2>

      {/* Same as shipping toggle */}
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={useSameAsShipping}
            onChange={(e) => onToggleSameAsShipping(e.target.checked)}
            className="h-4 w-4 text-[#2D4A3E] focus:ring-[#2D4A3E] border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">
            Same as shipping address
          </span>
        </label>
      </div>

      {!useSameAsShipping && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`appearance-none block w-full px-3 py-2 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D4A3E] focus:border-transparent ${
                  errors.fullName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-700 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.fullName}
                </p>
              )}
            </div>
          </div>

          {/* Email and Phone Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`appearance-none block w-full px-3 py-2 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D4A3E] focus:border-transparent ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-700 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number *
              </label>
              <div className="mt-1">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`appearance-none block w-full px-3 py-2 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D4A3E] focus:border-transparent ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-700 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Address Line 1 */}
          <div>
            <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">
              Address Line 1 *
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="addressLine1"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`appearance-none block w-full px-3 py-2 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D4A3E] focus:border-transparent ${
                  errors.addressLine1 ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your street address"
              />
              {errors.addressLine1 && (
                <p className="mt-1 text-sm text-red-700 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.addressLine1}
                </p>
              )}
            </div>
          </div>

          {/* Address Line 2 */}
          <div>
            <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700">
              Address Line 2 (Optional)
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="addressLine2"
                name="addressLine2"
                value={formData.addressLine2 || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`appearance-none block w-full px-3 py-2 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D4A3E] focus:border-transparent ${
                  errors.addressLine2 ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Apartment, suite, unit, etc."
              />
              {errors.addressLine2 && (
                <p className="mt-1 text-sm text-red-700 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.addressLine2}
                </p>
              )}
            </div>
          </div>

          {/* City, State, ZIP Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`appearance-none block w-full px-3 py-2 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D4A3E] focus:border-transparent ${
                    errors.city ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your city"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-700 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.city}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State *
              </label>
              <div className="mt-1">
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`appearance-none block w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2D4A3E] focus:border-transparent ${
                    errors.state ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select state</option>
                  {US_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {errors.state && (
                  <p className="mt-1 text-sm text-red-700 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.state}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                ZIP Code *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`appearance-none block w-full px-3 py-2 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D4A3E] focus:border-transparent ${
                    errors.postalCode ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="12345"
                />
                {errors.postalCode && (
                  <p className="mt-1 text-sm text-red-700 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.postalCode}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Country */}
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country *
            </label>
            <div className="mt-1">
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`appearance-none block w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2D4A3E] focus:border-transparent ${
                  errors.country ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="MX">Mexico</option>
              </select>
              {errors.country && (
                <p className="mt-1 text-sm text-red-700 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.country}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#2D4A3E] hover:bg-[#4A6B5A] text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </div>
              ) : (
                'Continue to Payment'
              )}
            </button>

            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          </div>
        </form>
      )}

      {useSameAsShipping && (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Billing Address</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>{shippingAddress.fullName}</p>
              <p>{shippingAddress.addressLine1}</p>
              {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
              <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
              <p>{shippingAddress.country}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => onSubmit(formData)}
              className="flex-1 bg-[#2D4A3E] hover:bg-[#4A6B5A] text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Continue to Payment
            </button>

            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}